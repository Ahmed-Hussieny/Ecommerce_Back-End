
import { DateTime } from "luxon";
import CouponUsers from "../../DB/Models/coupon-users.model.js";
import Coupon from "../../DB/Models/coupon.model.js";

export async function applyCouponValidation(couponCode, userId) {
  // Check if the coupon is valid
  const coupon = await Coupon.findOne({ couponCode });
  if (!coupon)
    return {
      status: 400,
      message: "Invalid Coupon",
    };
  // Check if the coupon is expired
  if (
    coupon.couponStatus === "expired" ||
    DateTime.now() > DateTime.fromJSDate(new Date(coupon.toDate))
  ) {
    return {
      status: 400,
      message: "Coupon is expired",
    };
  }
  // start date check
  if (
    DateTime.now() < DateTime.fromJSDate(new Date(coupon.fromDate))){
    return {
      status: 400,
      message: "Coupon is not started yet",
    }
}
// user States
    const isUserAssigned = await CouponUsers.findOne({ couponId: coupon._id, userId });
    if (!isUserAssigned) {
        return {
            status: 400,
            message: "Coupon is not valid for you",
        };
    }
    
    // max usage check
    if (isUserAssigned.maxUsage <= isUserAssigned.usageCount) {
        return {
            status: 400,
            message: "Coupon is expired max usage reached",
        }
    }

  return coupon;
  // Check if the coupon is already used by the user
  // Check if the coupon is valid for the user
}
