import Joi from "joi";
import { systemRoles } from "../../utils/system-roles.js";

//* update loggedIn user schema
export const updateLoggedInUserSchama = {
    body: Joi.object({
        username: Joi.string(),
        email: Joi.string().email(),
        phoneNumbers: Joi.array().items(Joi.string()),
        addresses: Joi.array().items(Joi.string()),
        age: Joi.number(),
        role: Joi.string().valid(systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER)
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
}

//* delete loggedIn user schema
export const deleteLoggedInUserSchema = {
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};

//* get user by id schema
export const getUserByIdSchema = {
    params: Joi.object({
        userId: Joi.string().required()
    })
};

//* update loggedIn user password schema
export const updateLoggedInUserPasswordSchema = {
    body: Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
    }),
    headers: Joi.object({
        accesstoken: Joi.string().required()
    }).unknown(true)
};