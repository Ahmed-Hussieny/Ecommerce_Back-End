import { Router } from "express";
import * as authController from "./auth.controller.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
    forgetPasswordSchema,
    resetPasswordSchema,
    signInSchema,
    signUpSchema,
    verifyEmailSchema,
    verifyResetCodeSchema,
} from "./auth.validationSchemas.js";
const authRouter = Router();

authRouter.post(
    "/signup",
    validationMiddleware(signUpSchema),
    expressAsyncHandler(authController.signUp)
);
authRouter.get(
    "/verifyEmail",
    validationMiddleware(verifyEmailSchema),
    expressAsyncHandler(authController.verifyEmail)
);
authRouter.post(
    "/signin",
    validationMiddleware(signInSchema),
    expressAsyncHandler(authController.signIn)
);
authRouter.post(
    "/forgotPassword",
    validationMiddleware(forgetPasswordSchema),
    expressAsyncHandler(authController.forgotPassword)
);
authRouter.post(
    "/verifyResetCode",
    validationMiddleware(verifyResetCodeSchema),
    expressAsyncHandler(authController.verifyResetCode)
);
authRouter.post(
    "/resetPassword",
    validationMiddleware(resetPasswordSchema),
    expressAsyncHandler(authController.resetPassword)
);

export default authRouter;
