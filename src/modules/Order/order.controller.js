import { DateTime } from "luxon";
import Cart from "../../../DB/Models/cart.model.js";
import CouponUsers from "../../../DB/Models/coupon-users.model.js";
import Order from "../../../DB/Models/order.model.js";
import Product from "../../../DB/Models/product.model.js";
import { generateQrCode } from "../../services/qrCode.service.js";
import { applyCouponValidation } from "../../utils/coupon.validation.js";
import { checkProductAvailability } from "../Cart/utils/check-product-in-db.js";
import { getUserCart } from "../Cart/utils/get-user-cart.js";
import { createCardToken, createCharge } from "../../services/tapPayment.js";

export const createOrderForProduct = async (req, res, next) => {
  const {
    productId,
    quantity,
    couponCode,
    paymentMethod,
    address,
    city,
    postalCode,
    country,
    phoneNumbers,
  } = req.body;
  const { _id: userId } = req.authUser;

  // coupon check
  let coupon = null;
  if (couponCode) {
    const isCouponValid = await applyCouponValidation(couponCode, userId);
    if (isCouponValid.status) {
      return next({
        message: isCouponValid.message,
        cause: isCouponValid.status,
      });
    }
    coupon = isCouponValid;
  }
  // product check
  const isProductAvailable = await checkProductAvailability(
    productId,
    quantity
  );
  if (!isProductAvailable) {
    return next({ message: "Product is not available", cause: 400 });
  }

  let orderItems = [
    {
      title: isProductAvailable.title,
      quantity,
      price: isProductAvailable.appliedPrice,
      productId: isProductAvailable._id,
    },
  ];
  let shippingPrice = orderItems[0].price * quantity;
  let totalPrice = shippingPrice;
  if (coupon) {
    if (coupon?.isFixed && coupon.couponAmount < shippingPrice) {
      totalPrice = shippingPrice - coupon.couponAmount;
    } else if (coupon?.isPrecentage) {
      totalPrice = shippingPrice - (shippingPrice * coupon.couponAmount) / 100;
    } else {
      return next({
        message: "coupon is not Valid",
        cause: 400,
      });
    }
  }

  let orderStatus;
  if (paymentMethod === "Cash") orderStatus = "Placed";

  const orderObject = {
    userId,
    orderItems,
    shippingAddress: { address, city, postalCode, country },
    phoneNumbers,
    shippingPrice,
    coupon: coupon?._id,
    totalPrice,
    paymentMethod,
    orderStatus,
  };
  const newOrder = await Order.create(orderObject);
  if (!newOrder) {
    return next({ message: "Order not created", cause: 500 });
  }

  isProductAvailable.stock -= quantity;
  await isProductAvailable.save();
  if (coupon) {
    await CouponUsers.updateOne(
      { couponId: coupon?._id, userId },
      { $inc: { usageCount: 1 } }
    );
  }

  const orderQrCode = await generateQrCode({
    orderId: newOrder._id,
    userId,
    orderStatus: newOrder.orderStatus,
    totalPrice: newOrder.totalPrice,
  });

  return res.status(201).json({
    message: "Order created",
    order: newOrder,
    orderQrCode,
  });
};

// & ============ CONVER CART TO ORDER =================
export const convertCartToOrder = async (req, res, next) => {
  const {
    couponCode,
    paymentMethod,
    address,
    city,
    postalCode,
    country,
    phoneNumbers,
  } = req.body;
  const { _id: userId } = req.authUser;

  // cart check
  const userCart = await getUserCart(userId);
  if (!userCart) return next({ message: "Cart is empty", cause: 400 });

  let coupon = null;

  if (couponCode) {
    const isCouponValid = await applyCouponValidation(couponCode, userId);
    if (isCouponValid.status)
      return next({
        message: isCouponValid.message,
        cause: isCouponValid.status,
      });
    coupon = isCouponValid;
  }

  let orderItems = userCart.products.map((cartItem) => {
    return {
      title: cartItem.title,
      quantity: cartItem.quantity,
      price: cartItem.finalPrice,
      productId: cartItem.productId,
    };
  });
  let shippingPrice = userCart.totalAmount;
  let totalPrice = shippingPrice;

  if (coupon) {
    if (coupon?.isFixed && coupon.couponAmount < shippingPrice) {
      totalPrice = shippingPrice - coupon.couponAmount;
    } else if (coupon?.isPrecentage) {
      totalPrice = shippingPrice - (shippingPrice * coupon.couponAmount) / 100;
    } else {
      return next({
        message: "coupon is not Valid",
        cause: 400,
      });
    }
  }

  // order status & payment
  let orderStatus;
  if (paymentMethod === "Cash") orderStatus = "Placed";
  const orderObject = {
    userId,
    orderItems,
    shippingAddress: { address, city, postalCode, country },
    phoneNumbers,
    shippingPrice,
    coupon: coupon?._id,
    totalPrice,
    paymentMethod,
    orderStatus,
  };

  for (const item of orderItems) {
    const isProductAvailable = await checkProductAvailability(
      item.productId,
      item.quantity
    );
    if (!isProductAvailable)
      return res
        .status(400)
        .json({
          message: "Product is not available",
          product: isProductAvailable,
        });
  }
  const newOrder = await Order.create(orderObject);
  if (!newOrder)
    return next({
      message: " Failed to create order",
    });
  // delete the cart
  await Cart.findByIdAndDelete(userCart._id);

  for (const item of orderItems) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: -item.quantity } }
    );
  }

  if (coupon) {
    await CouponUsers.updateOne(
      { couponId: coupon?._id, userId },
      { $inc: { usageCount: 1 } }
    );
  }
  return res
    .status(201)
    .json({ message: "Order created successfully", order: newOrder });
};

//& ========================== ORDER DELIVER =======================
export const deliverOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const { _id: userId } = req.authUser;

  const order = await Order.findOneAndUpdate(
    { _id: orderId, orderStatus: { $in: ["Paid", "Placed"] } },
    {
      isDelivered: true,
      orderStatus: "Delivered",
      deliveredAt: DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss"),
      deleveredBy: userId,
    },
    { new: true }
  );
  if (!order) return next({ message: "Order not found", cause: 404 });
  return res
    .status(200)
    .json({ message: "Order delivered successfully", order });
};

//& ========================== GET USER ORDERS =======================
export const getUserOrders = async (req, res, next) => {
  const { _id: userId } = req.authUser;
  const orders = await Order.find({
    userId,
  });
  if (!orders) return next({ message: "Orders not found", cause: 404 });
  return res
    .status(200)
    .json({ message: "Orders retrieved successfully", orders });
};

//& ========================== PAY WITH TAP =======================
export const payWithTap = async (req, res, next) => {
    const { orderId } = req.params;
    const { _id: userId } = req.authUser;
  
    // Validate input
    if (!orderId || !userId) {
      return next({ message: "Invalid order or user ID", cause: 400 });
    }
  
    // Find the order
    const order = await Order.findOne({ _id: orderId, userId, orderStatus: "Pending" });
    if (!order) {
      return next({ message: "Order not found", cause: 404 });
    }
  
    // Calculate total amount
    const totalAmount = order.orderItems.reduce((total, item) => total + (item.price || 0), 0);
    if (totalAmount <= 0) {
      return next({ message: "Invalid order total amount", cause: 400 });
    }
  
    // Generate a card token
    const cardToken = await createCardToken();
    if (!cardToken) {
      return res.status(500).json({ message: "Failed to create card token" });
    }
  
    // Create payment object
    const paymentObject = {
      amount: totalAmount,
      currency: "EGP",
      threeDSecure: false,
      save_card: false,
      statement_descriptor: "ORDER-PAY",
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
      reference: {
        transaction: `order_${order._id}`,
        order: `order_${order._id}`,
      },
      receipt: {
        email: true,
        sms: true,
      },
      customer: {
        first_name: req.authUser.username,
        email: req.authUser.email,
      },
      source: {
        id: cardToken, // Use the generated card token
      },
      post: {url: 'http://your_website.com/post_url'},
    redirect: {url: 'http://your_website.com/redirect_url'}
    };
  
    try {
      const paymentLink = await createCharge(paymentObject);
  
      if (!paymentLink) {
        return res.status(500).json({ message: "Failed to create payment link" });
      }
  
      return res.status(201).json({
        message: "Payment link created successfully. Proceed to payment.",
        paymentLink,
        success: true,
      });
    } catch (error) {
      console.error("Error creating payment link:", error.response?.data || error.message);
      return res.status(500).json({ message: "Failed to create payment link", error: error.message });
    }
  };