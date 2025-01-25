import { Router } from "express";
import * as messageService from "./services/message.service.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as validators from "./message.validation.js";

const router = Router();

router.post(
  "/",
  validation(validators.sendMessageSchema),
  messageService.sendMessage
);

export default router;
