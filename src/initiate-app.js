import { connection_DB } from "../DB/connection.js";
import * as routers from "./modules/index.routes.js";
import { globalResponse } from './middlewares/global-response.js';
import { rollbackUploadedFiles } from "./middlewares/rollback-uploaded-files-Middleware.js";
import { rollBackSavedDocument } from "./middlewares/rollback-saved-Document.Middlewares.js";
import { cronToChangeExpirationCoupons } from "./utils/crons.js";

export const initiateApp = ({app, express}) => {
    app.use(express.json());
    connection_DB();
    app.use('/api/v1/auth', routers.authRouter);
    app.use('/api/v1/user', routers.userRouter);
    app.use('/api/v1/category', routers.categoryRouter);
    app.use('/api/v1/subCategory', routers.subCategoryRouter);
    app.use('/api/v1/brand', routers.brandRouter);
    app.use('/api/v1/product', routers.productRouter);
    app.use('/api/v1/cart', routers.cartRouter);
    app.use('/api/v1/coupon', routers.couponRouter);
    app.use('/api/v1/order', routers.orderRouter);

    app.use('*',(req,res,next)=>{
        next({message:"Route not found",status:404});
    })
    app.use(globalResponse, rollbackUploadedFiles, rollBackSavedDocument);

    cronToChangeExpirationCoupons();
};