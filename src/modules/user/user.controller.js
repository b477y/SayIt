import { Router } from "express";
import * as userService from "./service/user.service.js";
import {
  authentication,
  authorization,
} from "../../middlewares/auth.middleware.js";
import { endpoint } from "./user.endpoint.js";

const router = Router();

router.get(
  "/profile",
  authentication,
  authorization(endpoint.profile),
  userService.profile
);

export default router;
