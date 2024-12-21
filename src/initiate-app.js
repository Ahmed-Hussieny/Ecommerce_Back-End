import { connection_DB } from "../DB/connection.js";
import * as routers from "./modules/index.routes.js";
import { globalResponse } from './middlewares/global-response.js';
import { rollbackUploadedFiles } from "./middlewares/rollback-uploaded-files-Middleware.js";
import { rollBackSavedDocument } from "./middlewares/rollback-saved-Document.Middlewares.js";

export const initiateApp = ({app, express}) => {
    app.use(express.json());
    connection_DB();
    app.use('/auth', routers.authRouter);
    app.use('/user', routers.userRouter);
    app.use('/category', routers.categoryRouter);
    app.use('/subCategory', routers.subCategoryRouter);
    app.use('/brand', routers.brandRouter);
    app.use('/product', routers.productRouter);

    app.use('*',(req,res,next)=>{
        next({message:"Route not found",status:404});
    })
    app.use(globalResponse, rollbackUploadedFiles, rollBackSavedDocument);
};