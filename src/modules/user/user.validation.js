import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.js";

export const updateProfile = joi
  .object()
  .keys({
    username: generalFields.username,
    phoneNumber: generalFields.phoneNumber,
    gender: generalFields.gender,
    DOB: generalFields.DOB,
  })
  .required();

export const updatePassword = joi
  .object()
  .keys({
    oldPassword: generalFields.password.required(),
    password: generalFields.password.invalid(joi.ref("oldPassword")).required(),
    confirmationPassword: generalFields.confirmationPassword.required(),
  })
  .required();

export const sharedProfile = joi
  .object()
  .keys({ userId: generalFields.userId.required() })
  .required();
