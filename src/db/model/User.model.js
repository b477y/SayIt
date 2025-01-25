import mongoose, { Schema, model } from "mongoose";
import { roleTypes } from "../../middlewares/auth.middleware.js";

export const genderTypes = {
  male: "male",
  female: "female",
};

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 25,
      trim: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(genderTypes),
      default: genderTypes.male,
    },
    DOB: Date,
    address: String,
    phone: String,
    image: String,
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(roleTypes),
      default: "User",
    },
    changePasswordTime: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.User || model("User", userSchema);

export default userModel;
