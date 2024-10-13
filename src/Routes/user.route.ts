import express from "express";
const router = express.Router();

import {
  getLoggedUser,
  updateLoggedUser,
  changePassword,
} from "../Controllers/user.controller.js";

import { guard } from "../Middleware/auth.middleware.js";

router.use(guard);
router.get("/profile", getLoggedUser);
router.put("/updateLoggedUser", updateLoggedUser);
router.put("/changePassword", changePassword);

export default router;
