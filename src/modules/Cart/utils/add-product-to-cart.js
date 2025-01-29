import { calculateTotalAmount } from "./calculate-totalAmount.js";

export const addProductToCart = async (userCart, product, quantity) => {
    userCart?.products.push({
        productId: product._id,
        quantity,
        originalPrice: product.appliedPrice,
        finalPrice: product.appliedPrice * quantity,
        title: product.title,
    });

    userCart.totalAmount = await calculateTotalAmount(userCart.products);

    return await userCart.save();
};