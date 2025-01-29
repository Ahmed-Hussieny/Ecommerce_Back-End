import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { couponEndPointsRoles } from "./coupon.endPoints.roles.js";
import { auth } from "../../middlewares/auth.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  addCouponSchema,
  deleteCouponSchema,
  getCouponSchema,
  getCouponsSchema,
  updateCouponSchema,
  validateCouponSchema,
} from "./coupon.validationSchemas.js";
const couponRouter = Router();
couponRouter.post(
  "/addCoupon",
  auth(couponEndPointsRoles.ADD_COUPON),
  validationMiddleware(addCouponSchema),
  expressAsyncHandler(couponController.addCoupon)
);
couponRouter.put(
  "/updateCoupon/:couponId",
  auth(couponEndPointsRoles.UPDATE_COUPON),
  validationMiddleware(updateCouponSchema),
  expressAsyncHandler(couponController.updateCoupon)
);
couponRouter.delete(
  "/deleteCoupon/:couponId",
  auth(couponEndPointsRoles.DELETE_COUPON),
  validationMiddleware(deleteCouponSchema),
  expressAsyncHandler(couponController.deleteCoupon)
);
couponRouter.get(
  "/getCoupon/:couponId",
  auth(couponEndPointsRoles.GET_COUPON),
  validationMiddleware(getCouponSchema),
  expressAsyncHandler(couponController.getCoupon)
);
couponRouter.get(
  "/getCoupons",
  auth(couponEndPointsRoles.GET_COUPON),
  validationMiddleware(getCouponsSchema),
  expressAsyncHandler(couponController.getcoupons)
);

couponRouter.get(
  "/validateCoupon",
  auth(couponEndPointsRoles.GET_COUPON),
  validationMiddleware(validateCouponSchema),
  couponController.validateCouponApi
);

export default couponRouter;
