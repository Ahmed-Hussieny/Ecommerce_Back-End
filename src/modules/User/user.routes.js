import { Router } from "express";
import * as userController from "./user.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  deleteLoggedInUserSchema,
  getUserByIdSchema,
  updateLoggedInUserPasswordSchema,
  updateLoggedInUserSchama,
} from "./user.validationSchemas.js";
import { userEndPointsRoles } from "./user.endPoints.roles.js";

const userRouter = Router();

userRouter.put(
  "/updateLoggedInUser",
  auth(userEndPointsRoles.UPDATE_USER),
  validationMiddleware(updateLoggedInUserSchama),
  expressAsyncHandler(userController.updateLoggedInUser)
);
userRouter.delete(
  "/deleteLoggedInUser",
  auth(userEndPointsRoles.DELETE_USER),
  validationMiddleware(deleteLoggedInUserSchema),
  expressAsyncHandler(userController.deleteLoggedInUser)
);
userRouter.get(
  "/getUserById/:userId",
  auth(userEndPointsRoles.GET_USER_BY_ID),
  validationMiddleware(getUserByIdSchema),
  expressAsyncHandler(userController.getUserById)
);
userRouter.put(
  "/updateLoggedInUserPassword",
  auth(userEndPointsRoles.UPDATE_USER_PASSWORD),
  validationMiddleware(updateLoggedInUserPasswordSchema),
  expressAsyncHandler(userController.updateLoggedInUserPassword)
);

export default userRouter;
