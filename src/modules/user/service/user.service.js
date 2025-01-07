import { asyncHandler } from "../../../utils/error/error.handling.js";
import { decrypt } from "../../../utils/crypto/crypto.js";
import { successResponse } from "../../../utils/response/success.response.js";

export const profile = asyncHandler(async (req, res, next) => {
  req.user.phoneNumber = decrypt({ cipherText: req.user.phoneNumber });
  return successResponse({
    res,
    message: "Profile retrieved successfully",
    data: req.user,
    status: 200,
  });
});
