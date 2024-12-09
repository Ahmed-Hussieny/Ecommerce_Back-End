import { Router } from 'express';
import * as userController from './user.controller.js';
import expressAsyncHandler from 'express-async-handler';
import { auth } from '../../middlewares/auth.middleware.js';
import { systemRoles } from '../../utils/system-roles.js';
const userRouter = Router();
userRouter.put('/updateLoggedInUser', auth([systemRoles.ADMIN, systemRoles.USER]), expressAsyncHandler(userController.updateLoggedInUser));
userRouter.delete('/deleteLoggedInUser', auth([systemRoles.ADMIN, systemRoles.USER]), expressAsyncHandler(userController.deleteLoggedInUser));
userRouter.get('/getUserById/:userId', auth([systemRoles.ADMIN, systemRoles.USER]), expressAsyncHandler(userController.getUserById));
userRouter.put('/updateLoggedInUserPassword', auth([systemRoles.ADMIN, systemRoles.USER]), expressAsyncHandler(userController.updateLoggedInUserPassword));


export default userRouter;