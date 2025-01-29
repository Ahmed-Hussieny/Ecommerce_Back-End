import Cart from "../../../../DB/Models/cart.model.js";

export const getUserCart = async (userId) => {
    const userCart = await Cart.findOne({ userId });
    return userCart;
};