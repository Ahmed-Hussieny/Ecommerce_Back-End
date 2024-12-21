
import slugify from 'slugify';
import Brand from '../../../DB/Models/brand.model.js';
import SubCategory from '../../../DB/Models/sub-category.model.js';
import { generateUniqueString } from '../../utils/generateUniqueString.js';
import cloudinaryConnection from '../../utils/cloudinary.js';
import { systemRoles } from '../../utils/system-roles.js';
import { APIFeatures } from '../../utils/api-feature.js';
//&================== ADD BRAND ==================//
export const addBrand = async (req, res, next) => {
    //* destructuring the data from the request body
    const {name, description} = req.body;
    const {subCategoryId} = req.query;
    const {_id:addedBy} = req.authUser;

    //* check if the subcategory exists
    const subCategory = await SubCategory.findById(subCategoryId).populate('categoryId');
    if(!subCategory) return next({cause: 404, message: 'SubCategory not found'}); 
    
    //* check if brand already exists
    const brand = await Brand.findOne({name, subCategoryId});
    if(brand) return next({cause: 409, message: 'Brand already exists'});

    //* generate the slug
    const slug = slugify(name);

    //* generate the folderId
    const folderId = generateUniqueString(10);

    //* check if image is uploaded
    if(!req.file) return next({cause: 400, message: 'Image is required'});
    const {secure_url, public_id} = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${subCategory.categoryId.folderId}/SubCategories/${subCategory.folderId}/Brands/${folderId}`
    })
    //* for rollback if the subCategory is not created
    req.folder = `${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${subCategory.categoryId.folderId}/SubCategories/${subCategory.folderId}/Brands/${folderId}`;

    //* brand object
    const brandObject = {
        name,
        description,
        slug,
        image:{
            secure_url,
            public_id
        },
        folderId,
        addedBy,
        subCategoryId
    }

    //* create the brand
    const newBrand = await Brand.create(brandObject);
    if(!newBrand) return next({cause: 500, message: 'Brand not created'});

    //* for rollback if the brand is not created
    req.savedDocument = {
        model: Brand,
        _id: newBrand._id
    }

    //* return the response
    return res.status(201).json({
        status: 'success',
        message: 'Brand created successfully',
        data: newBrand
    });
};

//&====================== UPDATE BRAND =====================//
export const updateBrand = async (req, res, next) => {
    //* destructuring the data from the request body
    const {name, description, oldPublicId} = req.body;
    const {brandId} = req.params;
    const {_id:updatedBy} = req.authUser;

    //* check if the brand exists
    const brand = await Brand.findById(brandId);
    if(!brand) return next({cause: 404, message: 'Brand not found'});

    //* check if the user is authorized to update the brand
    if(!brand.addedBy.equals(updatedBy) && req.authUser.role != systemRoles.ADMIN) 
        return next({cause: 403, message: 'You are not authorized to update this brand'});

    //* check if the name is unique
    if(name && name !== brand.name){
        const brandsOfSubCategory = await Brand.find({subCategoryId : brand.subCategoryId});
        const isNameUnique = brandsOfSubCategory.every(brand => brand.name !== name);
        if(!isNameUnique) return next({cause: 409, message: 'Brand name already exists in this sub Category'});
        
        //* update the name
        brand.name = name;
        
        //* generate the slug
        brand.slug = slugify(name);
    }

    //* update the description
    if(description) brand.description = description;

    //* update the public_id of the image
    if(oldPublicId){
        //* check if the image is uploaded
        if(!req.file){
            return next({
                message:"Please upload an image",
                cause: 400
            })
        }

        //* get the new public id
        const newPublicId = oldPublicId.split(`${brand.folderId}/`)[1];
        const folderPath = oldPublicId.split(`${brand.folderId}/`)[0];

        //* replace the old image with the new image
        const {secure_url} = await cloudinaryConnection().uploader.upload(req.file.path,{
            folder: `${folderPath}${brand.folderId}`,
            public_id: newPublicId
        });
        brand.image.secure_url = secure_url;
    }
    
    //* update the brand
    brand.updatedBy = updatedBy;
    const updatedBrand = await brand.save();
    if(!updatedBrand) return next({cause: 500, message: 'Brand not updated'});

    //* return the response
    return res.status(200).json({
        status: 'success',
        message: 'Brand updated successfully',
        data: updatedBrand
    });
};

//&================= DELETE BRAND ==================//
export const deleteBrand = async (req, res, next) => {
    //* destructing the the brand id
    const {brandId} = req.params;

    //* check if the brand exists
    const brand  = await Brand.findById(brandId).populate({path:'subCategoryId', populate:{path:'categoryId'}});
    if(!brand) return next({cause: 404, message: 'Brand not found'});

    //* check if the user is authorized to delete the brand
    if(!brand.addedBy.equals(req.authUser._id) && req.authUser.role != systemRoles.ADMIN)
        return next({cause: 403, message: 'You are not authorized to delete this brand'});

    //* delete the brand
    const deletedBrand = await Brand.findByIdAndDelete(brandId);
    if(!deletedBrand) return next({cause: 500, message: 'Brand not deleted'});

    // //* delete the image from cloudinary
    await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${brand.subCategoryId.categoryId.folderId}/SubCategories/${brand.subCategoryId.folderId}/brands/${brand.folderId}`);
    await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${brand.subCategoryId.categoryId.folderId}/SubCategories/${brand.subCategoryId.folderId}/brands/${brand.folderId}`);

    //* return the response
    return res.status(200).json({
        status: 'success',
        message: 'Brand deleted successfully'
    });
};

//&===================== GET ALL BRANDS =====================//
export const getAllBrands = async (req, res, next)=>{
    //* destructuring the query params
    const {page, size, sortBy, ...search} = req.query;
    //* get all brands
    const feature = new APIFeatures(req.query, Brand.find().populate('subCategoryId'));
    feature.pagination({page, size});
    feature.sort(sortBy);
    feature.search(search);
    const brands = await feature.mongooseQuery;
    if(!brands) return next({cause: 404, message: 'No brands found'});

    //* return the response
    return res.status(200).json({
        status: 'success',
        message: 'All brands found successfully',
        data: brands
    });
};

//&===================== GET BRAND BY ID =====================//
export const getBrandById = async (req, res, next)=>{
    //* destructuring the brand id
    const {brandId} = req.params;

    //* get the brand
    const brand = await Brand.findById(brandId);
    if(!brand) return next({cause: 404, message: 'Brand not found'});

    //* return the response
    return res.status(200).json({
        status: 'success',
        message: 'Brand found successfully',
        data: brand
    });
};