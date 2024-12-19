import Joi from "joi";

//* add Category Schema
export const addCategorySchema = {
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

//* update category schema
export const updateCategorySchema = {
    body: Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        oldPublicId: Joi.string()
    }),
    params: Joi.object({
        categoryId: Joi.string().required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

//* delete category schema
export const deleteCategorySchema = {
    params: Joi.object({
        categoryId: Joi.string().required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

//* get single category schema
export const getSingleCategorySchema = {
    params: Joi.object({
        categoryId: Joi.string().required()
    })
};