import Joi from "joi";

//* add sub Category Schema
export const addSubCategorySchema = {
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        categoryId: Joi.string().required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

//* update sub category schema
export const updateSubCategorySchema = {
    body: Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        oldPublicId: Joi.string()
    }),
    params: Joi.object({
        subCategoryId: Joi.string().required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

//* delete sub Category schema
export const deleteSubCategorySchema = {
    params: Joi.object({
        subCategoryId: Joi.string().required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

//* get single sub Category schema
export const getSingleCategorySchema = {
    params: Joi.object({
        subCategoryId: Joi.string().required()
    })
};