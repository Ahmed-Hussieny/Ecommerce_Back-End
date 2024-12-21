import mongoose, { model, Schema } from "mongoose";

const productSchema = new Schema({
    //* strings
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String
    },
    slug:{
        type: String,
        required: true,
        trim: true
    },
    folderId:{
        type: String,
        required: true,
        unique: true
    },

    //* numbers
    basePrice:{
        type: Number,
        required: true
    },
    disCount: {
        type: Number,
        default: 0
    },
    appliedPrice:{
        type: Number,
        required: true
    },
    stock:{
        type: Number,
        required: true,
        default: 0,
        min:0
    },
    rate:{
        type: Number,
        default: 0,
        min:0,
        max:5
    },

    //* object IDs
    addedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    brandId:{
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },

    //* arrays
    images:[{
        secure_url:{
            type: String,
            required: true
        },
        public_id:{
            type: String,
            required: true
        }
    }],
    specifications:{
        type:Map,
        of:[String, Number]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const Product = mongoose.models.Product || model('Product', productSchema);
export default Product;