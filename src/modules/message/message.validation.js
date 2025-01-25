import joi from "joi";
import {
  generalFields,
  validateObjectId,
} from "../../middlewares/validation.middleware.js";

export const sendMessageSchema = joi
  .object()
  .keys({
    message: joi.string().min(2).max(50000).required(),
    recepientId: generalFields.userId.required(),
  })
  .required();
