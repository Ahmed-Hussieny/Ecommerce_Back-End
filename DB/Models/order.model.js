import mongoose, { model, Schema } from 'mongoose';

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    orderItems:[
        {
            title: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    phoneNumbers: [
        { type: String, required: true }
    ],
    shippingPrice: { type: Number, required: true },
    coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum:['Cash', 'Stripe', 'Tap'], required: true },

    orderStatus:{type: String, enum:['Pending', 'Paid', 'Delivered', 'Placed', 'Cancelled'], required: true, default:'Pending'},
    isPaid:{type: Boolean, default: false},
    paidAt: {type: String},
    isDelivered:{type: Boolean, default: false},
    deliveredAt: {type: String},
    deleveredBy:{type: Schema.Types.ObjectId, ref: 'User'},
    isCancelled:{type: Boolean, default: false},
    cancelledAt: {type: String},
    cancelledBy:{type: Schema.Types.ObjectId, ref: 'User'},
    // coupon
}, { timestamps: true });

const Order = mongoose.models.Order || model('Order', orderSchema);
export default Order;