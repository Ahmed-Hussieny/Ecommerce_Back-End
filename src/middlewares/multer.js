import multer from 'multer';
import { allowedExtensions } from '../utils/allowedExtensions.js';

export const multerMiddlewareHost = ({
    extensions = allowedExtensions.image
}) =>{
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        if(extensions.includes(file.mimetype.split('/')[1])){
            cb(null, true);
        }else{
            cb(new Error('File type is not supported'), false);
        }
    };

    const file = multer({
        storage,
        fileFilter,
        // limits: {
        //     fileSize: 1024 * 1024 * 5
        // }
    });
    return file;
};