import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";
import { multerMiddlewareHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addCategorySchema, deleteCategorySchema, updateCategorySchema } from "./category.validationSchemas.js";
import { categoryEndPointsRoles } from "./category.endPoints.roles.js";

const categoryRouter = Router();

categoryRouter.post(
    "/addCategory",
    auth(categoryEndPointsRoles.ADD_CATEGORY),
    multerMiddlewareHost({ extensions: allowedExtensions.image }).single("image"),
    validationMiddleware(addCategorySchema),
    expressAsyncHandler(categoryController.addCategory)
);

categoryRouter.put(
    "/updateCategory/:categoryId",
    auth(categoryEndPointsRoles.UPDATE_CATEGORY),
    multerMiddlewareHost({ extensions: allowedExtensions.image }).single("image"),
    validationMiddleware(updateCategorySchema),
    expressAsyncHandler(categoryController.updateCategory)
);

categoryRouter.delete(
    "/deleteCategory/:categoryId",
    auth(categoryEndPointsRoles.DELETE_CATEGORY),
    validationMiddleware(deleteCategorySchema),
    expressAsyncHandler(categoryController.deleteCategory)
);

categoryRouter.get(
    "/getAllCategories",
    expressAsyncHandler(categoryController.getAllCategories)
);

categoryRouter.get(
    "/getSingleCategory/:categoryId",
    expressAsyncHandler(categoryController.getSingleCategory)
);

export default categoryRouter;
