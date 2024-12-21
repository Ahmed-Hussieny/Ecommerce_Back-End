import Joi from "joi";

export const addBrandSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
    }),
    query: Joi.object({
        subCategoryId: Joi.string().required(),
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required(),
    }).unknown(true),
};

export const updateBrandSchema = {
    body: Joi.object({
        name : Joi.string(), 
        description: Joi.string(),
        oldPublicId: Joi.string(),
    }),
    params: Joi.object({
        brandId: Joi.string().required(),
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required(),
    }).unknown(true),
}

export const deleteBrandSchema = {
    params: Joi.object({
        brandId: Joi.string().required(),
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required(),
    }).unknown(true),
};

export const getByIdBrandSchema = {
    params: Joi.object({
        brandId: Joi.string().required(),
    })
};