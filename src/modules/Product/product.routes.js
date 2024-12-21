import { Router } from "express";
import * as productController from "./product.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { multerMiddlewareHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addProductSchema, deleteProductSchema, getProductByIdSchema, updateProductSchema } from "./product.validationSchemas.js";
import { productEndPointsRoles } from "./product.endpoints.roles.js";
import  expressAsyncHandler  from 'express-async-handler';
const productRouter = Router();

productRouter.post("/addProduct",
    auth(productEndPointsRoles.ADD_PRODUCT),
    multerMiddlewareHost({extensions: allowedExtensions.image}).array('image', 5),
    validationMiddleware(addProductSchema),
    expressAsyncHandler(productController.addProduct));

productRouter.put("/updateProduct/:productId",
    auth(productEndPointsRoles.UPDATE_PRODUCT),
    multerMiddlewareHost({extensions: allowedExtensions.image}).single('image'),
    validationMiddleware(updateProductSchema),
    expressAsyncHandler(productController.updateProduct));

productRouter.delete("/deleteProduct/:productId",
    auth(productEndPointsRoles.DELETE_PRODUCT),
    validationMiddleware(deleteProductSchema),
    expressAsyncHandler(productController.deleteProduct));

productRouter.get("/getAllProducts",
    expressAsyncHandler(productController.getAllProducts));

productRouter.get("/getProductById/:productId",
    validationMiddleware(getProductByIdSchema),
    expressAsyncHandler(productController.getProductById));
    
export default productRouter;