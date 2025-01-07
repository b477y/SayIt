import userModel from "../../../db/model/User.model.js";
import { emailEvent } from "../../../events/sendEmail.event.js";
import { asyncHandler } from "../../../utils/error/error.handling.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { generateToken, verifyToken } from "../../../utils/token/token.js";
import { compareHash, generateHash } from "../../../utils/hash/hash.js";
import { encrypt } from "../../../utils/crypto/crypto.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password, confirmationPassword, phoneNumber, role } =
    req.body;

  if (!username) {
    return next(new Error("Username is required", { cause: 400 }));
  }
  if (!email) {
    return next(new Error("Email is required", { cause: 400 }));
  }
  if (!password) {
    return next(new Error("Password is required", { cause: 400 }));
  }
  if (!confirmationPassword) {
    return next(new Error("Confirmation password is required", { cause: 400 }));
  }
  if (!phoneNumber) {
    return next(new Error("Phone number is required", { cause: 400 }));
  }
  if (!role) {
    return next(new Error("Role is required", { cause: 400 }));
  }

  if (password !== confirmationPassword) {
    return next(
      new Error("The confirmation password doesn't match the password", {
        cause: 400,
      })
    );
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next(new Error("Email is already exist", { cause: 409 }));
  }

  const encryptedPhoneNumber = encrypt({ plainText: phoneNumber });

  const hashedPassword = generateHash({ inputString: password });

  emailEvent.emit("sendEmail", { email });

  const user = {
    username,
    email,
    password: hashedPassword,
    phoneNumber: encryptedPhoneNumber,
    role,
  };

  await userModel.create(user);

  return successResponse({
    res,
    message: "Registered successfully",
    data: user,
    status: 201,
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  const { email } = verifyToken({
    token: authorization,
    signature: process.env.TOKEN_SIGNATURE_EMAIL,
  });

  const emailConfirmation = await userModel.findOneAndUpdate(
    { email },
    { confirmEmail: true },
    { new: true }
  );

  return successResponse({
    res,
    message: "Account email confirmed successfully",
    data: emailConfirmation.confirmEmail,
    status: 201,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new Error("Email is required", { cause: 400 }));
  }
  if (!password) {
    return next(new Error("Password is required", { cause: 400 }));
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new Error("In-valid credentials", { cause: 404 }));
  }

  if (!user.confirmEmail) {
    return next(new Error("Please confirm your email first", { cause: 400 }));
  }

  const checkPassword = compareHash({
    inputString: password,
    hashedString: user.password,
  });

  if (!checkPassword) {
    return next(new Error("In-valid credentials", { cause: 404 }));
  }

  const token = generateToken({
    payload: { id: user._id, isLoggedIn: true },
    signature:
      user.role === "Admin"
        ? process.env.TOKEN_SIGNATURE_ADMIN
        : process.env.TOKEN_SIGNATURE_USER,
    options: { expiresIn: "1h" },
  });

  return successResponse({
    res,
    message: "Logged in successfully",
    data: token,
    status: 201,
  });
});
