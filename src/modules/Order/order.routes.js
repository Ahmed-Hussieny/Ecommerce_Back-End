import { Router } from "express";
import * as orderController from "./order.controller.js";
import { orderEndPointsRoles } from "./order.endPoints.roles.js";
import { auth } from "../../middlewares/auth.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { convertCartToOrderSchema, createOrderForProductSchema, deliverOrderSchema, getOrderSchema, payWithTapSchema } from "./order.validationSchemas.js";
const orderRouter = Router();
orderRouter.post(
  "/create-order-for-product",
  auth(orderEndPointsRoles.ADD_ORDER),
  validationMiddleware(createOrderForProductSchema),
  expressAsyncHandler(orderController.createOrderForProduct)
);
orderRouter.post(
  "/convert-cart-to-order",
  auth(orderEndPointsRoles.CONVERT_CART_TO_ORDER),
  validationMiddleware(convertCartToOrderSchema),
  expressAsyncHandler(orderController.convertCartToOrder)
);
orderRouter.put(
  "/deliverOrder/:orderId",
  auth(orderEndPointsRoles.DELIVER_ORDER),
  validationMiddleware(deliverOrderSchema),
  expressAsyncHandler(orderController.deliverOrder)
);
orderRouter.get(
  "/getMyOrders",
  auth(orderEndPointsRoles.GET_ORDERS),
  validationMiddleware(getOrderSchema),
  expressAsyncHandler(orderController.getUserOrders)
);
orderRouter.post(
  "/pay-with-tap/:orderId",
  auth(orderEndPointsRoles.PAY_WITH_TAP),
  validationMiddleware(payWithTapSchema),
  expressAsyncHandler(orderController.payWithTap)
);

export default orderRouter;
