import { Router } from "express";
import * as authService from "./service/auth.service.js";
import * as validators from "./auth.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";

const router = Router();

router.post("/signup", validation(validators.signup), authService.signup);
router.patch("/confirm-email", authService.confirmEmail);
router.post("/login", validation(validators.login), authService.login);

export default router;
