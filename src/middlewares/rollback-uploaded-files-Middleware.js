import cloudinaryConnection from "../utils/cloudinary.js";

//& rollbacks uploaded files
export const rollbackUploadedFiles = async (req, res, next) => {
    if(req.folder){
        const folder = req.folder;
        await cloudinaryConnection().api.delete_resources_by_prefix(folder);
        await cloudinaryConnection().api.delete_folder(folder);
    }
    next();
};