export const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => total + product.finalPrice, 0);
};