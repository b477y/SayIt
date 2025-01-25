import { Router } from "express";
import * as userService from "./service/user.service.js";
import {
  authentication,
  authorization,
} from "../../middlewares/auth.middleware.js";
import { endpoint } from "./user.endpoint.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as validators from "./user.validation.js";

const router = Router();

router.get(
  "/profile",
  authentication,
  authorization(endpoint.profile),
  userService.profile
);

router.patch(
  "/profile",
  validation(validators.updateProfile),
  authentication,
  authorization(endpoint.profile),
  userService.updateProfile
);

router.patch(
  "/profile/password",
  validation(validators.updatePassword),
  authentication,
  authorization(endpoint.profile),
  userService.updatePassword
);

router.delete(
  "/profile",
  authentication,
  authorization(endpoint.profile),
  userService.freezeAccount
);

router.get(
  "/:userId/profile",
  validation(validators.sharedProfile),
  userService.sharedProfile
);

router.get("/messages", authentication, userService.getMessages);
export default router;
