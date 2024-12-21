import slugify from "slugify";
import Category from "../../../DB/Models/category.model.js";
import { generateUniqueString } from "../../utils/generateUniqueString.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import SubCategory from "../../../DB/Models/sub-category.model.js";
import { systemRoles } from "../../utils/system-roles.js";
import Brand from '../../../DB/Models/brand.model.js';
import { APIFeatures } from "../../utils/api-feature.js";

//&================== ADD SUBCATEGORY ==================//
export const addSubCategory = async (req, res, next) => {
    //* destructing the requestBody
    const { name, description, categoryId } = req.body;
    const {_id: addedBy} = req.authUser;

    //* check if the category exists
    const category = await Category.findById(categoryId);
    if(!category){
        return next({
            message: 'Category not found',
            cause: 404
        })
    }

    //* check if the subCategory name already exists
    const isSubCategoryExist = await SubCategory.findOne({name});
    if(isSubCategoryExist){
        return next({
            message: 'SubCategory already exists',
            cause: 400
        })
    }

    //* create a slug from name 
    const slug = slugify(name);

    //* create folderId for the subCategory
    const folderId = generateUniqueString(10);

    //* check if the image is uploaded
    if(!req.file){
        return next({
            message: 'Please upload an image',
            cause: 400
        })
    }
    //* upload the image to cloudinary
    const {secure_url, public_id} = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${category.folderId}/SubCategories/${folderId}`
    })

    //* for rollback if the subCategory is not created
    req.folder = `${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${category.folderId}/SubCategories/${folderId}`;

    //* subCategory object
    const subCategoryObject = {
        name,
        slug,
        description,
        image:{
            secure_url,
            public_id
        },
        folderId,
        addedBy,
        categoryId
    }

    //* create the subCategory
    const newSubCategory = await SubCategory.create(subCategoryObject);
    if(!newSubCategory){
        return next({
            message: 'SubCategory not created',
            cause: 500
        })
    }
    req.savedDocument = {
        model: SubCategory,
        _id: newSubCategory._id
    }
    //* return the response
    return res.status(201).json({
        success: true,
        message: 'SubCategory created successfully',
        newSubCategory
    })
};

//&=================== UPDATE SUBCATEGORY ==================//
export const updateSubCategory = async (req, res, next) => {
    //* destructing the requestBody
    const { name, description, oldPublicId } = req.body;
    const { subCategoryId } = req.params;
    const {_id: updatedBy} = req.authUser;

    //* check if the subCategory exists
    const subCategory = await SubCategory.findById(subCategoryId);
    if(!subCategory){
        return next({
            message: 'SubCategory not found',
            cause: 404
        })
    }

    //* check if the subCategory is owned by the user
    if(!subCategory.addedBy.equals(updatedBy) && req.authUser.role !== systemRoles.ADMIN){
        return next({
            message: 'Unauthorized access to update the subCategory',
            cause: 403
        })
    }

    //* check if the subCategory name is changed
    if(name && name !== subCategory.name){
        //* check if the new name is already taken
        const isSubCategoryExist = await SubCategory.findOne({name});
        if(isSubCategoryExist){
            return next({
                message: 'SubCategory already exists',
                cause: 400
            })
        }
        subCategory.name = name;
        subCategory.slug = slugify(name);
    }
    
    //* check if the description is changed
    if(description) subCategory.description = description;

    //* update the public_id of the image
    if(oldPublicId){
    
        //* check if the image is uploaded
        if(!req.file){
            return next({
                message: 'Please upload an image',
                cause: 400
            })
        }

        //* get the new public id
        const newPublicId = oldPublicId.split(`${subCategory.folderId}/`)[1];
        const folderPath = oldPublicId.split(`${subCategory.folderId}/`)[0];
        
        //* replace the old image with the new image
        const { secure_url } = await cloudinaryConnection().uploader.upload(req.file.path, {
            folder: `${folderPath}${subCategory.folderId}`,
            public_id: newPublicId
        })
        subCategory.image.secure_url = secure_url;
    }

    //* update the subCategory
    subCategory.updatedBy = updatedBy;
    const updatedSubCategory = await subCategory.save();
    if(!updatedSubCategory){
        return next({
            message: 'SubCategory not updated',
            cause: 500
        })
    }
    //* return the response
    return res.status(200).json({
        success: true,
        message: 'SubCategory updated successfully',
        updatedSubCategory
    })
};

//&=================== DELETE SUBCATEGORY ==================//
export const deleteSubCategory = async (req, res, next) => {
    //* destructing the categoryId
    const { subCategoryId } = req.params;
    
    //* check if the subCategory exists
    const subCategory = await SubCategory.findById(subCategoryId).populate('categoryId');
    if(!subCategory){
        return next({
            message: 'SubCategory not found',
            cause: 404
        })
    }
    //* check if the user is authorized to delete the brand
    if(!subCategory.addedBy.equals(req.authUser._id) && req.authUser.role != systemRoles.ADMIN)
        return next({cause: 403, message: 'You are not authorized to delete this brand'});
    
    //* delete all brands of the subCategory
    const brands = await Brand.find({subCategoryId});
    await Brand.deleteMany({subCategoryId});

    //* delete the subCategory
    const deletedSubCategory = await SubCategory.findByIdAndDelete(subCategoryId);
    if(!deletedSubCategory){
        return next({
            message: 'SubCategory not deleted',
            cause: 500
        })
    }
    
    //* delete products of the subCategory
    

    //* delete images from cloudinary
    await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${subCategory.categoryId.folderId}/SubCategories/${subCategory.folderId}`);
    await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${subCategory.categoryId.folderId}/SubCategories/${subCategory.folderId}`);

    //* return the response
    return res.status(200).json({
        success: true,
        message: 'SubCategory deleted successfully',
        deletedSubCategory
    })
};

//&=================== GET ALL SUBCATEGORIES ==================//
export const getAllSubCategories = async (req, res, next) => {
    //* destructuring the data from the request body
    const {page, size, sortBy, ...search} = req.query;
    //* get all subCategories
    const feature = new APIFeatures(req.query, SubCategory.find().populate('Brands'));
    feature.pagination({page, size});
    feature.sort(sortBy);
    feature.search(search);
    
    const subCategories = await feature.mongooseQuery;
    if(!subCategories){
        return next({
            message: 'SubCategories not found',
            cause: 404
        })
    }
    //* return the response
    return res.status(200).json({
        success: true,
        message: 'SubCategories found successfully',
        subCategories
    })
};

//&=================== GET SINGLE SUBCATEGORY ==================//
export const getSingleSubCategory = async (req, res, next) => {
    //* get the subCategoryId from the params
    const { subCategoryId } = req.params;
    //* check if the subCategory exists
    const subCategory = await SubCategory.findById(subCategoryId).populate('Brands');
    if(!subCategory){
        return next({
            message: 'SubCategory not found',
            cause: 404
        })
    }
    //* return the response
    return res.status(200).json({
        success: true,
        message: 'SubCategory found successfully',
        subCategory
    })
};