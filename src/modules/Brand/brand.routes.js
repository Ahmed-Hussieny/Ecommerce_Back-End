import { Router } from "express";
import * as brandController from "./brand.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { brandEndPointsRoles } from "./brand.endPoints.roles.js";
import { multerMiddlewareHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addBrandSchema, deleteBrandSchema, getByIdBrandSchema, updateBrandSchema } from "./brand.validationSchemas.js";
import expressAsyncHandler from "express-async-handler";
const brandRouter = Router();

brandRouter.post(
    "/addBrand",
    auth(brandEndPointsRoles.ADD_BRAND),
    multerMiddlewareHost({ extensions: allowedExtensions.image }).single("image"),
    validationMiddleware(addBrandSchema),
    expressAsyncHandler(brandController.addBrand)
);

brandRouter.put(
    '/updateBrand/:brandId',
    auth(brandEndPointsRoles.UPDATE_BRAND),
    multerMiddlewareHost({ extensions: allowedExtensions.image }).single("image"),
    validationMiddleware(updateBrandSchema),
    expressAsyncHandler(brandController.updateBrand)
)

brandRouter.delete(
    '/deleteBrand/:brandId',
    auth(brandEndPointsRoles.DELETE_BRAND),
    validationMiddleware(deleteBrandSchema),
    expressAsyncHandler(brandController.deleteBrand)
)

brandRouter.get(
    '/getAllBrands',
    expressAsyncHandler(brandController.getAllBrands)
)

brandRouter.get(
    '/getBrandById/:brandId',
    validationMiddleware(getByIdBrandSchema),
    expressAsyncHandler(brandController.getBrandById)
)

export default brandRouter;