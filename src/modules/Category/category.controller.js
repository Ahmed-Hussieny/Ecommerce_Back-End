import Category from "../../../DB/Models/category.model.js";
import slugify from "slugify";
import { generateUniqueString } from "../../utils/generateUniqueString.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import SubCategory from "../../../DB/Models/sub-category.model.js";
import Brand from "../../../DB/Models/brand.model.js";
import { systemRoles } from "../../utils/system-roles.js";

//&================== ADD CATEGORY ==================//
export const addCategory = async (req, res, next) => {
  //* destructing the requestBody
  const { name, description } = req.body;
  const { _id: addedBy } = req.authUser;

  //*chech if the category already exists
  const isCategoryExist = await Category.findOne({ name });
  if (isCategoryExist)
    return next({
      message: "Category already exists",
      cause: 400,
    });

    //* create a slug
    const slug = slugify(name);

    //* create folderId for the category
    const folderId = generateUniqueString(10);

    //* check if the image is uploaded
    if(!req.file){
        return next({
            message: 'Please upload an image',
            cause: 400
        })
    }
    //* upload the image to cloudinary
    const {secure_url, public_id} = await cloudinaryConnection().uploader.upload(req.file.path,{
        folder: `${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${folderId}`
    })

    //* for rollback if the category is not created
    req.folder = `${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${folderId}`;
    
    //* category object
    const categoryObject = {
        name,
        slug,
        description,
        image:{
            secure_url,
            public_id
        },
        folderId,
        addedBy
    }
    //* create the category
    const newCategory = await Category.create(categoryObject);
    if(!newCategory){
        return next({
            message: 'Category not created',
            cause: 500
        })
    }
    req.savedDocument = {
        model: Category,
        _id: newCategory._id,
    }
    //* return the response
    return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        newCategory
    })
};

//&================= UPDATE CATEGORY ================//
export const updateCategory = async (req, res, next) => {
    //* destructing the requestBody
    const { name, description, oldPublicId } = req.body;
    const { categoryId } = req.params;
    const {_id: updatedBy} = req.authUser;
    
    //* check if the category exists
    const category = await Category.findById(categoryId);
    if(!category){
        return next({
            message: 'Category not found',
            cause: 404
        })
    }
    //* check if the category name is changed
    if(name){
        //* check if the category name already exists
        const isCategoryExist = await Category.findOne({name});
        if(isCategoryExist){
            return next({
                message: 'please choose a different Category name',
                cause: 400
            })
        }
        category.name = name;
        category.slug = slugify(name);
    }
    if(description) category.description = description;
    if(oldPublicId){
        //* check if the image is uploaded
        if(!req.file){
            return next({
                message: 'Please upload an image',
                cause: 400
            })
        }
        //* upload the image to cloudinary
        const newPublicId = oldPublicId.split(`${category.folderId}/`)[1];
        //* replace the old image with the new image
        const {secure_url} = await cloudinaryConnection().uploader.upload(req.file.path,{
            folder: `${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${category.folderId}`,
            public_id: newPublicId
        })
        category.image.secure_url = secure_url;
    }
    //* update the category
    category.updatedBy = updatedBy;
    const updatedCategory = await category.save();
    if(!updatedCategory){
        return next({
            message: 'Category not updated',
            cause: 500
        })
    }
    //* return the response
    return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        updatedCategory
    })
};

//&================= DELETE CATEGORY ================//
export const deleteCategory = async (req, res, next) => {
    //* destructing the categoryId
    const { categoryId } = req.params;
    //* check if the category exists
    const category = await Category.findById(categoryId);
    if(!category){
        return next({
            message: 'Category not found',
            cause: 404
        });
    }
    //* check if the user is authorized to delete the brand
    if(!category.addedBy.equals(req.authUser._id) && req.authUser.role != systemRoles.ADMIN)
        return next({cause: 403, message: 'You are not authorized to delete this brand'});
        
    //* delete the category
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if(!deletedCategory){
        return next({
            message: 'Category not deleted',
            cause: 500
        })
    }
    //* delete subCategories
    const subCategories = await SubCategory.find({categoryId: categoryId});
    await SubCategory.deleteMany({categoryId: categoryId});

    //* delete brands
    await Brand.deleteMany({subCategoryId: {$in: subCategories.map(subCategory => subCategory._id)}});

    //* delete images from cloudinary
    await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${category.folderId}`);
    await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${category.folderId}`);

    //* return the response
    return res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
        deletedCategory
    })
};

//&================= GET ALL CATEGORIES ================//
export const getAllCategories = async (req, res, next) => {
    //* get all categories
    const categories = await Category.find().populate({
        path:'subCategories'
    });
    if(!categories){
        return next({
            message: 'Categories not found',
            cause: 404
        })
    }
    //* return the response
    return res.status(200).json({
        success: true,
        message: 'All categories',
        categories
    })
};

//&================= GET SINGLE CATEGORY ================//
export const getSingleCategory = async (req, res, next) => {
    //* get the category id
    const { categoryId } = req.params;
    //* check if the category exists
    const category = await Category.findById(categoryId).populate({
        path:'subCategories'
    });
    if(!category){
        return next({
            message: 'Category not found',
            cause: 404
        })
    }
    //* return the response
    return res.status(200).json({
        success: true,
        message: 'Category found',
        category
    })
};