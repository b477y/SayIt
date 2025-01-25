import joi from "joi";
import { genderTypes } from "../db/model/User.model.js";
import { Types } from "mongoose";

export const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid objectId");
};

export const generalFields = {
  username: joi.string().min(2).max(25),
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "edu", "net"] },
    })
    .messages({
      "string.email": "please enter valid email format like email@example.com",
      "string.empty": "email can not be empty",
      "any.required": "email is required",
    }),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
  confirmationPassword: joi.string().valid(joi.ref("password")).messages({
    "any.only": "the confirmation password should match the password",
  }),
  phoneNumber: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
  role: joi.string().valid("Admin", "User"),
  "accept-language": joi
    .string()
    .valid("en", "ar")
    .insensitive(true)
    .default("en")
    .empty(false)
    .messages({
      "any.only": "The lang header should be EN or AR",
      "any.required": "The lang header are required",
      "string.empty": "The lang header should't be empty it should be EN or AR",
    }),
  gender: joi
    .string()
    .valid(genderTypes.male, genderTypes.female)
    .insensitive(true),
  DOB: joi.date().less("now"),
  userId: joi.custom(validateObjectId),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputData = {
      ...req.body,
      ...req.query,
      ...req.params,
    };

    if (req.headers["accept-language"]) {
      inputData["accept-language"] = req.headers["accept-language"];
    }

    const signupValidation = schema.validate(inputData, {
      abortEarly: false,
    });

    if (signupValidation.error) {
      return res
        .status(400)
        .json({ validationError: signupValidation.error.details });
    }
    return next();
  };
};
