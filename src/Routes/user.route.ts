import express from "express";
const router = express.Router();

import {
  getLoggedUser,
  updateLoggedUser,
  changePassword,
} from "../Controllers/user.controller.js";

import {
  updateUserValidator,
  changePasswordValidator,
} from "../Validators/user.validator.js";

import { guard } from "../Middleware/auth.middleware.js";

router.use(guard);
router.get("/profile", getLoggedUser);
router.put("/updateLoggedUser", updateUserValidator, updateLoggedUser);
router.put("/changePassword", changePasswordValidator, changePassword);

export default router;
