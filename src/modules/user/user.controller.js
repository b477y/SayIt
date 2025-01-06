import { Router } from "express";
import * as userService from "./service/user.service.js";
import {
  authentication,
  authorization,
} from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", authentication, authorization(['Admin']), userService.profile);

export default router;
