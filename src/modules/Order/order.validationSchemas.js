import Joi from "joi";
import { objectIdValidator } from "../../utils/customRules.js";

export const createOrderForProductSchema = {
    body: Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().required(),
        couponCode: Joi.string(),
        paymentMethod: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().required(),
        phoneNumbers: Joi.array().items(Joi.string()).required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

export const convertCartToOrderSchema = {
    body: Joi.object({
        couponCode: Joi.string(),
        paymentMethod: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().required(),
        phoneNumbers: Joi.array().items(Joi.string()).required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

export const deliverOrderSchema = {
    params: Joi.object({
        orderId: Joi.string().custom(objectIdValidator).required(),
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

export const payWithTapSchema = {
    params: Joi.object({
        orderId: Joi.string().custom(objectIdValidator).required(),
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

export const getOrderSchema = {
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};