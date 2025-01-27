import { EventEmitter } from "node:events";
import generateEmailTemplate from "../utils/email/templates/confirmEmailTemplate.js";
import sendEmail from "../utils/email/email.js";
import { asyncHandler } from "../utils/error/error.handling.js";
import { generateToken } from "../utils/token/token.js";

export const emailEvent = new EventEmitter();

emailEvent.on(
  "sendEmail",
  asyncHandler(async (data) => {
    const { email } = data;
    const emailToken = generateToken({
      payload: { email },
      signature: process.env.TOKEN_SIGNATURE_EMAIL,
    });

    const emailLink = `${process.env.FE_URL}/confirm-email/${emailToken}`;
    const html = generateEmailTemplate(emailLink);
    await sendEmail({ to: email, subject: "Confirm-Email", html });
  })
);
