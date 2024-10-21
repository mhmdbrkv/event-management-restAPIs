import express from "express";
const router = express.Router();

import {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "../Controllers/auth.controller.js";

import {
  signupValidator,
  loginValidator,
  newPasswordValidator,
} from "../Validators/auth.validator.js";

import { guard } from "../Middleware/auth.middleware.js";

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

router.use(guard);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", newPasswordValidator, resetPassword);

export default router;
