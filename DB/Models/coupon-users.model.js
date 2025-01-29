import mongoose, { model, Schema } from "mongoose";

const couponUsersSchema = new Schema({
    couponId:{
        type: Schema.Types.ObjectId,
        ref: "Coupon",
        required: true,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    maxUsage:{
        type: Number,
        required: true,
        min: 1,
    },
    usageCount:{
        type: Number,
        default: 0,
    },
},
{
    timestamps: true
})

const CouponUsers = mongoose.models.CouponUsers || model('CouponUser', couponUsersSchema)
export default CouponUsers