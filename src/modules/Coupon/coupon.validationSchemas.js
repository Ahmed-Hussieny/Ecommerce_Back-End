import Joi from "joi";
import { objectIdValidator } from "../../utils/customRules.js";

export const addCouponSchema = {
  body: Joi.object().keys({
    couponCode: Joi.string().required(),
    couponAmount: Joi.number().required(),
    isFixed: Joi.boolean().required(),
    isPrecentage: Joi.boolean().required(),
    fromDate: Joi.date().required(),
    toDate: Joi.date().required(),
    users: Joi.array().items(
      Joi.object().keys({
        userId: Joi.string().required(),
        maxUsage: Joi.number().required(),
      })
    ),
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required(),
  }).unknown(true),
};

export const updateCouponSchema = {
  body: Joi.object().keys({
    couponCode: Joi.string(),
    couponAmount: Joi.number(),
    isFixed: Joi.boolean(),
    isPrecentage: Joi.boolean(),
    fromDate: Joi.date(),
    toDate: Joi.date(),
    users: Joi.array().items(
      Joi.object().keys({
        userId: Joi.string(),
        maxUsage: Joi.number(),
      })
    ),
  }),
  params: Joi.object({
    couponId: Joi.string().custom(objectIdValidator).required(),
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required(),
  }).unknown(true),
};

export const deleteCouponSchema = {
  params: Joi.object({
    couponId: Joi.string().custom(objectIdValidator).required(),
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required(),
  }).unknown(true),
};

export const getCouponSchema = {
  params: Joi.object({
    couponId: Joi.string().custom(objectIdValidator).required(),
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required(),
  }).unknown(true),
};

export const getCouponsSchema = {
  headers: Joi.object({
    accesstoken: Joi.string().required(),
  }).unknown(true),
};

export const validateCouponSchema = {
  body: Joi.object().keys({
    couponCode: Joi.string().required(),
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required(),
  }).unknown(true),
};