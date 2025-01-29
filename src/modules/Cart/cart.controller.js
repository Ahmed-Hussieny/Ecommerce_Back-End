import Cart from "../../../DB/Models/cart.model.js";
import Product from "../../../DB/Models/product.model.js";
import { addCart } from "./utils/add-cart.js";
import { addProductToCart } from "./utils/add-product-to-cart.js";
import { calculateTotalAmount } from "./utils/calculate-totalAmount.js";
import { checkProductAvailability } from "./utils/check-product-in-db.js";
import { getUserCart } from "./utils/get-user-cart.js";
import { updateProductQuantity } from "./utils/update-product-quantity.js";

//& ===================== ADD TO CART ===================== &//
export const addToCart = async (req, res, next) => {
    const { productId, quantity } = req.body;
    const {_id:userId} = req.authUser;
    // Check if product exists
    const product = await checkProductAvailability(productId, quantity);
    if(!product){
        return next({message: 'Product not found', cause: 404});
    }
    // check if user has cart or not
    const userCart = await getUserCart(userId);
    if(!userCart){ // if user has no cart, create one
        const newCart = await addCart(userId, product, quantity);
        if(!newCart){
            return next({message: 'Failed to add product to cart', cause: 500});
        }
        // return new cart
        return res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            cart: newCart
        });
    }
    // if user has cart and product is not in the cart
    const isUpdated = await updateProductQuantity(userCart, productId, quantity);
    if(!isUpdated){
        // if product is not in the cart, add it
        const newCart = await addProductToCart(userCart, product, quantity);
        if(!newCart){
            return next({message: 'Failed to add product to cart', cause: 500});
        }
    }
    // return updated cart
    return res.status(200).json({
        success: true,
        message: 'Product added to cart successfully',
        cart: userCart
    });
};

//& ===================== REMOVE FROME CART ===================== &//
export const removeFromCart = async (req, res, next) => {
    const { productId } = req.params;
    const {_id:userId} = req.authUser;
    // check if user has cart
    const userCart = await Cart.findOne({userId,
        'products.productId': productId
    });
    if(!userCart){
        return next({message: 'Product not found in cart', cause: 404});
    }
    // remove product from cart
    userCart.products = userCart.products.filter(product => product.productId.toString() !== productId);
    userCart.totalAmount = await calculateTotalAmount(userCart.products);
    const updatedCart = await userCart.save();
    if(!updatedCart){
        return next({message: 'Failed to remove product from cart', cause: 500});
    }
    // return updated cart
    return res.status(200).json({
        success: true,
        message: 'Product removed from cart successfully',
        cart: updatedCart
    });
};

//& ===================== GET CART ===================== &//
export const getCart = async (req, res, next) => {
    const {_id:userId} = req.authUser;
    // check if user has cart
    const userCart = await getUserCart(userId);
    if(!userCart){
        return next({message: 'Cart not found', cause: 404});
    }
    // return user cart
    return res.status(200).json({
        success: true,
        cart: userCart
    });
};

//& ===================== CLEAR CART ===================== &//
export const clearCart = async (req, res, next) => {
    const {_id:userId} = req.authUser;
    // check if user has cart
    const userCart = await getUserCart(userId);
    if(!userCart){
        return next({message: 'Cart not found', cause: 404});
    }
    // clear cart
    userCart.products = [];
    userCart.totalAmount = 0;
    const updatedCart = await userCart.save();
    if(!updatedCart){
        return next({message: 'Failed to clear cart', cause: 500});
    }
    // return updated cart
    return res.status(200).json({
        success: true,
        message: 'Cart cleared successfully',
        cart: updatedCart
    });
};