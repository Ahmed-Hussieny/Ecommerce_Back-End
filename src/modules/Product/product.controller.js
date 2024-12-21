import slugify from "slugify";
import Brand from "../../../DB/Models/brand.model.js";
import { generateUniqueString } from "../../utils/generateUniqueString.js";
import Product from "../../../DB/Models/product.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import { APIFeatures } from "../../utils/api-feature.js";

//&================== ADD PRODUCT ==================//
export const addProduct = async (req, res, next) => {
    //* destructuring the data from the request body
    const {title, description, basePrice, disCount, stock, specifications} = req.body;
    const {brandId} = req.query;
    const {_id: addedBy} = req.authUser;

    //* check if the brand exists
    const brand = await Brand.findById(brandId);
    if(!brand) return next({cause: 404, message: 'Brand not found'});

    //* check if the user is authorized to add product
    if(!brand.addedBy.equals(addedBy) && req.authUser.role != systemRoles.ADMIN)
        return next({cause: 403, message: 'You are not authorized to add product to this brand'});

    //* generate the slug
    const slug = slugify(title);

    //* calculate the applied price
    const appliedPrice = basePrice - (basePrice * (disCount || 0) / 100);

    //* check if images are uploaded
    if(!req.files || req.files.length === 0) return next({cause: 400, message: 'Please upload at least one image'});
    
    //* generate the folderId
    const folderId = generateUniqueString(10);

    //* upload the images to cloudinary
    const images = [];
    const brandFolderPath = brand.image.public_id.split(`${brand.folderId}/`)[0];

    for(const file of req.files){
        const {secure_url, public_id} = await cloudinaryConnection().uploader.upload(file.path, {
            folder: `${brandFolderPath}${brand.folderId}/products/${folderId}`
        });
        images.push({secure_url, public_id});
    }

    //* for rollback if the product is not created
    req.folder = `${brandFolderPath}${brand.folderId}/products/${folderId}`;

    //* product object
    const productObject = {
        title,
        slug,
        description,
        folderId,
        basePrice,
        disCount,
        appliedPrice,
        stock,
        specifications : JSON.parse(specifications),
        images,
        brandId,
        addedBy
    }
    //* create the product
    const newProduct = await Product.create(productObject);
    if(!newProduct) return next({cause: 500, message: 'Product not created'});

    //* for rollback if the product is not created
    req.savedDocument = {
        model: Product,
        _id: newProduct._id
    }

    //* return the response
    return res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        data: newProduct
    });

};

//&================== UPDATE PRODUCT ==================//
export const updateProduct = async (req, res, next) => {
    //* destructuring the data from the request body
    const {title, description, basePrice, disCount, stock, specifications, rate, oldPublicId} = req.body;
    const {productId} = req.params;
    const {_id: updatedBy} = req.authUser;

    //* check if the product exists
    const product = await Product.findById(productId);
    if(!product) return next({cause: 404, message: 'Product not found'});

    //* check if the user is authorized to update product
    if(!product.addedBy.equals(updatedBy) && req.authUser.role != systemRoles.ADMIN)
        return next({cause: 403, message: 'You are not authorized to update this product'});

    //* update values of product
    if(title){
        product.title = title;
        product.slug = slugify(title);
    }
    if(description) product.description = description;
    if(stock) product.stock = stock;
    if(specifications) product.specifications = JSON.parse(specifications);
    if(rate) product.rate = rate;
    //* applied price
    product.appliedPrice = (basePrice || product.basePrice) - ((basePrice || product.basePrice) * (disCount || product.disCount) / 100);
    if(basePrice) product.basePrice = basePrice;
    if(disCount) product.disCount = disCount;
    
    //* need to update image of the product
    if(oldPublicId){
        //* check if image are uploaded
        if(!req.file) return next({cause: 400, message: 'Please upload an image'});

        //* generate the new public_id
        const newPublicId = oldPublicId.split(`${product.folderId}/`)[1];
        const folderPath = oldPublicId.split(`${product.folderId}/`)[0];

        //* upload the image to cloudinary
        const {secure_url} = await cloudinaryConnection().uploader.upload(req.file.path,{
            folder: `${folderPath}${product.folderId}`,
            public_id: newPublicId
        });
        //* replace the old image with the new image
        product.images.map(image => {
            if(image.public_id === oldPublicId) image.secure_url = secure_url;
        });
    }

    //* update the product
    product.updatedBy = updatedBy;
    const updatedProduct = await product.save();
    if(!updatedProduct) return next({cause: 500, message: 'Product not updated'});

    //* return the response
    return res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: updatedProduct
    });
};

//&================== DELETE PRODUCT ==================//
export const deleteProduct = async (req, res, next) => {
    //* destructuring the data from the request body
    const {productId} = req.params;
    const {_id: deletedBy} = req.authUser;

    //* check if the product exists
    const product = await Product.findById(productId).populate({path:'brandId', populate:{path:'subCategoryId', populate:{path:'categoryId'}}});
    if(!product) return next({cause: 404, message: 'Product not found'});

    //* check if the user is authorized to delete product
    if(!product.addedBy.equals(deletedBy) && req.authUser.role != systemRoles.ADMIN)
        return next({cause: 403, message: 'You are not authorized to delete this product'});

    //* delete the product
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if(!deletedProduct) return next({cause: 500, message: 'Product not deleted'});

    //* delete the images from cloudinary
    await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${product.brandId.subCategoryId.categoryId.folderId}/SubCategories/${product.brandId.subCategoryId.folderId}/brands/${product.brandId.folderId}/products/${product.folderId}`);
    await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_CLOUDINARY_FOLDER}/Categories/${product.brandId.subCategoryId.categoryId.folderId}/SubCategories/${product.brandId.subCategoryId.folderId}/brands/${product.brandId.folderId}/products/${product.folderId}`);


    //* return the response
    return res.status(200).json({
        status: 'success',
        message: 'Product deleted successfully',
        product
    });
};

//&================== GET ALL PRODUCTS ==================//
export const getAllProducts = async (req, res, next) => {
    //* destructuring the data from the request body
    const {page, size, sortBy, ...search} = req.query;
    const feature = new APIFeatures(req.query, Product.find());
    feature.pagination({page, size});
    feature.sort(sortBy)
    feature.search(search);

    const products = await feature.mongooseQuery;
    if(!products) return next({cause: 404, message: 'Products not found'});
    //* return the response
    return res.status(200).json({
        status: 'success',
        message: 'All products found successfully',
        products
    });
};

//&================== GET PRODUCT BY ID ==================//
export const getProductById = async (req, res, next) => {
    //* destructuring the data from the request body
    const {productId} = req.params;

    //* get the product
    const product = await Product.findById(productId);
    if(!product) return next({cause: 404, message: 'Product not found'});
    //* return the response
    return res.status(200).json({
        status: 'success',
        message: 'Product found successfully',
        data: product
    });
};