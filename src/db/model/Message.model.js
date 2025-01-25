import mongoose, { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50000,
    },
    recepientId: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const messageModel = mongoose.models.Message || model("Message", messageSchema);

export default messageModel;
