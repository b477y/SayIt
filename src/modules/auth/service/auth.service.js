import userModel from "../../../db/model/User.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password, confirmationPassword, phoneNumber } =
      req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!confirmationPassword) {
      return res
        .status(400)
        .json({ message: "Confirmation password is required" });
    }
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const encryptedPhoneNumber = CryptoJS.AES.encrypt(
      phoneNumber,
      process.env.PHONE_ENCRYPTION
    ).toString();

    if (password !== confirmationPassword) {
      return res.status(400).json({
        message: "The confirmation password doesn't match the password",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    const user = {
      username,
      email,
      password: hashedPassword,
      phoneNumber: encryptedPhoneNumber,
    };

    await userModel.create(user);

    return res.status(201).json({ message: "Registered successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ errMsg: error.message, errStack: error.stack });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "In-valid credentials" });
    }

    const checkPassword = bcrypt.compareSync(password, existingUser.password);

    if (!checkPassword) {
      return res.status(404).json({ messsage: "In-valid credentials" });
    }

    const token = jwt.sign({ existingUser }, process.env.TOKEN_SIGNATURE, {
      expiresIn: 60 * 60,
    });

    return res.status(201).json({ message: "Logged in successfully", token });
  } catch (error) {
    return res
      .status(500)
      .json({ errMsg: error.message, errStack: error.stack });
  }
};
