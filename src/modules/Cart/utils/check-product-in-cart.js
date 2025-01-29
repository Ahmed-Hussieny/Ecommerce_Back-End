export const checkProductAvailabilityInCart = async (userCart, productId) => {
    return userCart.products.find(
        (cartProduct) => cartProduct.productId.toString() === productId.toString()
    );
};