import { asyncHandler } from "../../../utils/error/error.handling.js";
import { decrypt, encrypt } from "../../../utils/crypto/crypto.js";
import { successResponse } from "../../../utils/response/success.response.js";
import userModel from "../../../db/model/User.model.js";
import { compareHash, generateHash } from "../../../utils/hash/hash.js";
import messageModel from "../../../db/model/Message.model.js";

export const profile = asyncHandler(async (req, res, next) => {
  req.user.phoneNumber = decrypt({ cipherText: req.user.phoneNumber });

  const recepientId = req.user._id;

  const messages = await messageModel
    .find({ recepientId })
    .populate([{ path: "recepientId", select: "_id username email" }]);

  return successResponse({
    res,
    message: "Profile retrieved successfully",
    data: { user: req.user, messages },
    status: 200,
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  if (req.body.phoneNumber) {
    req.body.phoneNumber = encrypt({ plainText: req.body.phoneNumber });
  }

  const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  return successResponse({
    res,
    message: "Profile updated successfully",
    data: user,
    status: 200,
  });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, password } = req.body;

  if (
    !compareHash({ inputString: oldPassword, hashedString: req.user.password })
  ) {
    return next(new Error("In-valid user password", { cause: 400 }));
  }

  const hashedPassword = generateHash({ inputString: password });

  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { password: hashedPassword, changePasswordTime: Date.now() },
    { new: true }
  );

  return successResponse({
    res,
    message: "Password updated successfully",
    data: user,
    status: 200,
  });
});

export const freezeAccount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { isDeleted: true, changePasswordTime: Date.now() },
    { new: true }
  );

  return successResponse({
    res,
    message: "Password updated successfully",
    data: user,
    status: 200,
  });
});

export const sharedProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.params.userId)
    .lean()
    .select("username image -_id");

  if (!user) {
    return next(new Error("In-valid account Id", { cause: 404 }));
  }

  return successResponse({
    res,
    message: "User profile retrieved",
    data: user,
    status: 200,
  });
});

export const getMessages = asyncHandler(async (req, res, next) => {
  const recepientId = req.user._id;

  const messages = await messageModel.find({ recepientId });

  if (!messages || messages.length === 0) {
    return next(new Error("There are no messages to display", { cause: 404 }));
  }

  return successResponse({
    res,
    message: "All messages retrieved successfully",
    status: 200,
    data: messages,
  });
});
