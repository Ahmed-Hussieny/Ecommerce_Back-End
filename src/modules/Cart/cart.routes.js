import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { cartEndPointsRoles } from "./cart.endPoints.roles.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addToCartSchema, clearCartSchema, getCartSchema, removeFromCartSchema } from "./cart.validationSchemas.js";
const cartRouter = Router();

cartRouter.post(
  "/add-to-cart",
  auth(cartEndPointsRoles.ADD_TO_CART),
  validationMiddleware(addToCartSchema),
  cartController.addToCart
);
cartRouter.delete(
  "/remove-from-cart/:productId",
  auth(cartEndPointsRoles.REMOVE_FROM_CART),
  validationMiddleware(removeFromCartSchema),
  cartController.removeFromCart
);
cartRouter.get(
  "/get-cart",
  auth(cartEndPointsRoles.GET_CART),
  validationMiddleware(getCartSchema),
  cartController.getCart
);
cartRouter.post(
  "/clear-cart",
  auth(cartEndPointsRoles.CLEAR_CART),
  validationMiddleware(clearCartSchema),
  cartController.clearCart
);
export default cartRouter;
