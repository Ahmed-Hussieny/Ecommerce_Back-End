import Cart from "../../../../DB/Models/cart.model.js";

export const addCart = async (userId, product, quantity) => {
    const cartObject = {
        userId,
        products: [
            {
                productId: product._id,
                quantity,
                originalPrice: product.appliedPrice,
                finalPrice: product.appliedPrice * quantity,
                title: product.title
            }
        ],
        totalAmount: product.appliedPrice * quantity
    };
    const newCart = await Cart.create(cartObject);
    return newCart;
};