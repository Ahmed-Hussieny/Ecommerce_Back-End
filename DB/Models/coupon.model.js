import mongoose, { model, Schema } from "mongoose";

const couponSchema = new Schema({
    couponCode: { type: String, required: true, unique: true, lowercase: true, trim: true },
    couponAmount: { type: Number, required: true, min: 1 },
    couponStatus: { type: String, default: "valid", enum: ["valid", "expired"] },
    isFixed: { type: Boolean, default: false },
    isPrecentage: { type: Boolean, default: false },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Coupon = mongoose.models.Coupon || model("Coupon", couponSchema);
export default Coupon;