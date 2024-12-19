import Joi from 'joi'
import { systemRoles } from '../../utils/system-roles.js';

//* schema for signUp
export const signUpSchema = {
    body:Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        phoneNumbers: Joi.array().items(Joi.string()),
        addresses: Joi.array().items(Joi.string()),
        role: Joi.string().valid(systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER),
        age: Joi.number().min(18).max(100).required()
    })
};

//* schema for verifyEmail
export const verifyEmailSchema = {
    query: Joi.object({
        userToken: Joi.string().required()
    })
};

//* schema for signIn
export const signInSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
}

//* schema for forgotPassword
export const forgetPasswordSchema = {
    body: Joi.object({
        email: Joi.string().email().required()
    })
};

//* schema for verifyResetCode
export const verifyResetCodeSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        resetCode: Joi.string().required()
    })
};

//* schema for resetPassword
export const resetPasswordSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        resetCode: Joi.string().required(),
        newPassword: Joi.string().required()
    })
};