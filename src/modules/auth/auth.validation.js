import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.js";

export const signup = joi
  .object()
  .keys({
    username: generalFields.username.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmationPassword: generalFields.confirmationPassword.required(),
    phoneNumber: generalFields.phoneNumber.required(),
    role: generalFields.role.required(),
    "accept-language": generalFields["accept-language"].required(),
  })
  .options({ allowUnknown: false })
  .required();

export const login = joi
  .object()
  .keys({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  })
  .options({ allowUnknown: false })
  .required();
