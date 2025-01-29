import mongoose, { model, Schema } from "mongoose";

const cartSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products:[{
        productId: {type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number, default: 1},
        originalPrice: {type: Number, required: true, default: 0},
        finalPrice: {type: Number, required: true, default: 0},
        title: {type: String, required: true},
    }],
    totalAmount: {type: Number, required: true, default: 0},
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Cart = model('Cart', cartSchema) || mongoose.models.Cart;
export default Cart;