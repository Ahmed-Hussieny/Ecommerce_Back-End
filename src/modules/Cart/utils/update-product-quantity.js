import { calculateTotalAmount } from "./calculate-totalAmount.js";
import { checkProductAvailabilityInCart } from "./check-product-in-cart.js";

export const updateProductQuantity = async (userCart, productId, quantity) => {
    const isProductAvailable = await checkProductAvailabilityInCart(userCart, productId);
    if (!isProductAvailable) {
        return null;
    }

    userCart?.products.forEach((product) => {
        if (product.productId.toString() === productId.toString()) {
            product.quantity = quantity;
            product.finalPrice = product.originalPrice * quantity;
        }
    });
    userCart.totalAmount = await calculateTotalAmount(userCart.products);
    return await userCart.save();
};