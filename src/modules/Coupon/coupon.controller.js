import CouponUsers from "../../../DB/Models/coupon-users.model.js";
import Coupon from "../../../DB/Models/coupon.model.js";
import User from "../../../DB/Models/user.model.js";
import { applyCouponValidation } from "../../utils/coupon.validation.js";

//& ===================== ADD COUPON ===================== //
export const addCoupon = async (req, res, next) => {
  let {
    couponCode,
    couponAmount,
    isFixed,
    isPrecentage,
    fromDate,
    toDate,
    users, // [{userId, maxUsage}]
  } = req.body;

  const addedBy = req.authUser._id;
  const isCouponExist = await Coupon.findOne({ couponCode });
  if (isCouponExist) {
    return next({ message: "Coupon already exist", cause: 400 });
  }
  fromDate = new Date(fromDate);
  toDate = new Date(toDate);
  const today = new Date();
  // validate the fromDate and toDate of the coupon
  if (fromDate < today) {
    return next({
      message: "From date must be greater than or equal to today",
      cause: 400,
    });
  }
  if (fromDate > toDate) {
    return next({
      message: "From date must be less than to date",
      cause: 400,
    });
  }
  // Check if coupon is fixed or percentage
  if (isFixed && isPrecentage) {
    return next({
      message: "Coupon can be either fixed or percentage",
      cause: 400,
    });
  }

  // check if coupon amount is valid
  if (isFixed) {
    if (couponAmount <= 0) {
      return next({
        message: "Coupon amount must be greater than 0",
        cause: 400,
      });
    }
  }
  if (isPrecentage) {
    if (couponAmount <= 0 || couponAmount > 100) {
      return next({
        message: "Coupon percentage must be between 1 and 100",
        cause: 400,
      });
    }
  }

  const newCoupon = await Coupon.create({
    couponCode,
    couponAmount,
    isFixed,
    isPrecentage,
    fromDate,
    toDate,
    addedBy,
  });
  if (!newCoupon) {
    return next({ message: "Coupon not created", cause: 500 });
  }
  // Save coupon to req.savedDocument
  req.savedDocument = { model: Coupon, _id: newCoupon._id };
  // Add coupon to users
  const userIds = [];
  for (const user of users) {
    userIds.push(user.userId);
  }
  const userExist = await User.find({ _id: { $in: userIds } });
  if (userExist.length !== userIds.length) {
    return next({ message: "User not found", cause: 400 });
  }
  const couponUsers = await CouponUsers.create(
    users.map((user) => ({
      couponId: newCoupon._id,
      userId: user.userId,
      maxUsage: user.maxUsage,
    }))
  );
  if (!couponUsers) {
    return next({ message: "Coupon not created", cause: 500 });
  }

  return res.status(201).json({
    message: "Coupon added successfully",
    data: newCoupon,
    couponUsers,
  });
};

//& ===================== UPDATE COUPON ===================== //
export const updateCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const {
    couponCode,
    couponAmount,
    isFixed,
    isPrecentage,
    fromDate,
    toDate,
    users,
  } = req.body;
  const updatedBy = req.authUser._id;
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    return next({ message: "Coupon not found", cause: 404 });
  }
  const updateData = {};
  if (couponCode && coupon.couponCode != couponCode) {
    const isCouponExist = await Coupon.findOne({ couponCode });
    if (isCouponExist) {
      return next({ message: "Coupon already exist", cause: 400 });
    }
    updateData.couponCode = couponCode;
  }
  if (couponAmount) updateData.couponAmount = couponAmount;
  if (isFixed) updateData.isFixed = isFixed;
  if (isPrecentage) updateData.isPrecentage = isPrecentage;
  if (fromDate) updateData.fromDate = fromDate;
  if (toDate) updateData.toDate = toDate;
  updateData.updatedBy = updatedBy;
  const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updateData, {
    new: true,
  });
  if (!updatedCoupon) {
    return next({ message: "Coupon not updated", cause: 500 });
  }
  // Update coupon users
  if (users) {
    const userIds = [];
    for (const user of users) {
      userIds.push(user.userId);
    }
    const userExist = await User.find({ _id: { $in: userIds } });
    if (userExist.length !== userIds.length) {
      return next({ message: "User not found", cause: 400 });
    }
    const couponUsers = await CouponUsers.find({ couponId });
    for (const user of users) {
      const couponUser = couponUsers.find((c) => c.userId == user.userId);
      if (!couponUser) {
        await CouponUsers.create({
          couponId,
          userId: user.userId,
          maxUsage: user.maxUsage,
        });
      } else {
        await CouponUsers.findByIdAndUpdate(couponUser._id, {
          maxUsage: user.maxUsage,
        });
      }
    }
  }
  return res.status(200).json({
    message: "Coupon updated successfully",
    data: updatedCoupon,
  });
};

//& ===================== DELETE COUPON ===================== //
export const deleteCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    return next({ message: "Coupon not found", cause: 404 });
  }
  const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
  if (!deletedCoupon) {
    return next({ message: "Coupon not deleted", cause: 500 });
  }
  await CouponUsers.deleteMany({ couponId });
  return res.status(200).json({
    message: "Coupon deleted successfully",
  });
};

//& ===================== GET COUPON ===================== //
export const getCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    return next({ message: "Coupon not found", cause: 404 });
  }
  const couponUsers = await CouponUsers.find({ couponId });
  return res.status(200).json({
    message: "Coupon fetched successfully",
    data: { coupon, couponUsers },
  });
};

//& ===================== GET COUPONS ===================== //
export const getcoupons = async (req, res, next) => {
    const coupons = await Coupon.find();
    return res.status(200).json({
        message: "Coupons fetched successfully",
        data: coupons
    });
};

//& ======================== Validate COUPON ======================== //
export const validateCouponApi = async (req, res, next) => {
    const { couponCode } = req.body;
    const { _id } = req.authUser;
    //^ apply coupon validation
    const isCouponValid = await applyCouponValidation(couponCode, _id);
    if (isCouponValid.status) {
      return res.status(isCouponValid.status).json({ message: isCouponValid.message });
    }
    return res.status(200).json({ message: "Coupon is Valid" });
  };