import messageModel from "../../../db/model/Message.model.js";
import userModel from "../../../db/model/User.model.js";
import { asyncHandler } from "../../../utils/error/error.handling.js";
import { successResponse } from "../../../utils/response/success.response.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { message, recepientId } = req.body;

  const user = await userModel.findOne({ _id: recepientId, isDeleted: false });

  if (!user) {
    throw new Error("In-valid recipient", { cause: 404 });
  }

  const newMessage = await messageModel.create({
    message,
    recepientId,
  });

  return successResponse({
    res,
    message: "Message sent successfully",
    status: 201,
  });
});