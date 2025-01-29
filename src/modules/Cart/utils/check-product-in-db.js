import Product from "../../../../DB/Models/product.model.js";

export const checkProductAvailability = async (productId, quantity) => {
    const product = await Product.findById(productId);
    if(!product || product.stock < quantity){
        return null;
    }
    return product;
};