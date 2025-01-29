import mongoose from "mongoose";

export const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid'); 
    }
    return value;
  };