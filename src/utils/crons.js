import { scheduleJob } from "node-schedule";
import { DateTime } from "luxon";
import Coupon from "../../DB/Models/coupon.model.js";

export async function cronToChangeExpirationCoupons() {
  scheduleJob("0 0 0 * * *", async () => {
    console.log("Running cronToChangeExpirationCoupons()");
    const coupons = await Coupon.find({ couponStatus: "valid" });
    for (const coupon of coupons) {
      if (DateTime.now() > DateTime.fromJSDate(new Date(coupon.toDate))) {
        coupon.couponStatus = "expired";
        await coupon.save();
      }
    }
  });
}
