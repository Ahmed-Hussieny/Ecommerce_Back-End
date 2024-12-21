import Joi from "joi";

//* add Product Schema
export const addProductSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        disCount: Joi.number().default(0),
        basePrice: Joi.number().required(),
        stock: Joi.number().required().default(0).min(0),
        rate: Joi.number().default(0).min(0).max(5),
        specifications: Joi.any()
    }),
    query: Joi.object({
        brandId: Joi.string().required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

//* update Product Schema
export const updateProductSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        disCount: Joi.number().default(0),
        basePrice: Joi.number(),
        stock: Joi.number().default(0).min(0),
        rate: Joi.number().default(0).min(0).max(5),
        oldPublicId: Joi.string(),
        specifications: Joi.any()
    }),
    params: Joi.object({
        productId: Joi.string().required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

//* delete Product Schema
export const deleteProductSchema = {
    params: Joi.object({
        productId: Joi.string().required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

//* get Product by Id Schema
export const getProductByIdSchema = {
    params: Joi.object({
        productId: Joi.string().required()
    })
};