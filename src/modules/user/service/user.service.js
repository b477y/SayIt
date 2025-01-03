import userModel from "../../../db/model/User.model.js";
import jwt from "jsonwebtoken";

export const profile = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const decoded = jwt.verify(authorization, process.env.TOKEN_SIGNATURE);
    return res.status(200).json({ decoded });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
