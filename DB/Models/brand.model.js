import mongoose, { model, Schema } from "mongoose";

const brandSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        trim: true
    },
    image:{
        secure_url:{
            type: String,
            required: true,
        },
        public_id:{
            type: String,
            required: true,
        }
    },
    folderId:{
        type: String,
        required: true,
        unique: true
    },
    addedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    subCategoryId:{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}) 

const Brand = mongoose.models.Brand || model('Brand', brandSchema);
export default Brand;