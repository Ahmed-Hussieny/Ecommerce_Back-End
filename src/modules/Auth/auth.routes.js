import { Router } from "express";
import * as authController from './auth.controller.js';
import expressAsyncHandler from 'express-async-handler'
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";
const authRouter = Router();

authRouter.post('/signup', expressAsyncHandler(authController.signUp));
authRouter.get('/verifyEmail',auth([systemRoles.ADMIN,systemRoles.USER]), expressAsyncHandler(authController.verifyEmail));
authRouter.post('/signin', expressAsyncHandler(authController.signIn));
authRouter.post('/forgotPassword', expressAsyncHandler(authController.forgotPassword));
authRouter.post('/verifyResetCode', expressAsyncHandler(authController.verifyResetCode));
authRouter.post('/resetPassword', expressAsyncHandler(authController.resetPassword));



export default authRouter;