import mongoose, { Schema } from 'mongoose';
const categorySchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description:{
        type: String
    },
    image:{
        secure_url:{
            type: String,
            required: true
        },
        public_id:{
            type: String,
            required: true
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
        ref: 'User'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

categorySchema.virtual('subCategories', {
    ref: 'SubCategory',
    localField: '_id',
    foreignField: 'categoryId'
});
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;