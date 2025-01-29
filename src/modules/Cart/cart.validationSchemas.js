import Joi from "joi";
import { objectIdValidator } from "../../utils/customRules.js";

export const addToCartSchema = {
    body: Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

export const removeFromCartSchema = {
    params: Joi.object({
        productId: Joi.string().custom(objectIdValidator).required(),
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

export const getCartSchema = {
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

export const clearCartSchema = {
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};