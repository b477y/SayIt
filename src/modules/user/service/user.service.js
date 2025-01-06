import { asyncHandler } from "../../../utils/error/error.handling.js";

export const profile = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ user: req.user });
});
