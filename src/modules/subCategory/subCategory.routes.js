import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { multerMiddlewareHost } from "../../middlewares/multer.js";
import * as subCategoryController from "./subCategory.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addSubCategorySchema, deleteSubCategorySchema, getSingleCategorySchema, updateSubCategorySchema } from "./subCategory.validationSchemas.js";
import { subCategoryEndPointsRoles } from "./subCategory.endPoints.roles.js";

const subCategoryRouter = Router();

subCategoryRouter.post(
    "/addSubCategory",
    auth(subCategoryEndPointsRoles.ADD_SUB_CATEGORY),
    multerMiddlewareHost({ extensions: allowedExtensions.image }).single("image"),
    validationMiddleware(addSubCategorySchema),
    expressAsyncHandler(subCategoryController.addSubCategory)
);

subCategoryRouter.put(
    "/updateSubCategory/:subCategoryId",
    auth(subCategoryEndPointsRoles.UPDATE_SUB_CATEGORY),
    multerMiddlewareHost({ extensions: allowedExtensions.image }).single("image"),
    validationMiddleware(updateSubCategorySchema),
    expressAsyncHandler(subCategoryController.updateSubCategory)
);

subCategoryRouter.delete(
    "/deleteSubCategory/:subCategoryId",
    auth(subCategoryEndPointsRoles.DELETE_SUB_CATEGORY),
    validationMiddleware(deleteSubCategorySchema),
    expressAsyncHandler(subCategoryController.deleteSubCategory)
);

subCategoryRouter.get(
    "/getAllSubCategories",
    expressAsyncHandler(subCategoryController.getAllSubCategories)
);

subCategoryRouter.get(
    "/getSingleSubCategory/:subCategoryId",
    validationMiddleware(getSingleCategorySchema),
    expressAsyncHandler(subCategoryController.getSingleSubCategory)
);


export default subCategoryRouter;