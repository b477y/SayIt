import userModel from "../../../db/model/User.model.js";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { emailEvent } from "../../../events/sendEmail.event.js";
import { asyncHandler } from "../../../utils/error/error.handling.js";

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
    return next(new Error("Email is already registered", { cause: 409 }));
  }

  const encryptedPhoneNumber = CryptoJS.AES.encrypt(
    phoneNumber,
    process.env.PHONE_ENCRYPTION
  ).toString();

  const hashedPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );

  emailEvent.emit("sendEmail", { email });

  const user = {
    username,
    email,
    password: hashedPassword,
    phoneNumber: encryptedPhoneNumber,
    role,
  };

  await userModel.create(user);

  return res.status(201).json({ message: "Registered successfully", user });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { emailToken } = req.body;
  const { email } = await jwt.verify(
    emailToken,
    process.env.TOKEN_SIGNATURE_EMAIL
  );

  const emailConfirmation = await userModel.findOneAndUpdate(
    { email },
    { confirmEmail: true },
    { new: true }
  );

  console.log(emailConfirmation);
  return res.status(201).json({
    message: "Account email confirmed successfully",
    confirmEmail: emailConfirmation.confirmEmail,
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

  const checkPassword = bcrypt.compareSync(password, user.password);

  if (!checkPassword) {
    return next(new Error("In-valid credentials", { cause: 404 }));
  }

  const token = jwt.sign(
    { id: user._id, isLoggedIn: true },

    user.role === "Admin"
      ? process.env.TOKEN_SIGNATURE_ADMIN
      : process.env.TOKEN_SIGNATURE_USER,

    {
      expiresIn: "1h",
    }
  );

  return res.status(201).json({ message: "Logged in successfully", token });
});
