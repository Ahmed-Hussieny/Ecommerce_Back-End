import { connection_DB } from "../DB/connection.js";
import * as routers from "./modules/index.routes.js";
import { globalResponse } from './middlewares/global-response.js';

export const initiateApp = ({app, express}) => {
    app.use(express.json());
    connection_DB();
    app.use('/auth', routers.authRouter);
    app.use('/user', routers.userRouter);

    app.use('*',(req,res,next)=>{
        next({message:"Route not found",status:404});
    })
    app.use(globalResponse);
};