import express from "express";
const router = express.Router();

import { guard } from "./../Middleware/auth.middleware.js";
import {
  createCheckoutSession,
  checkoutSuccess,
} from "../Controllers/payment.controller.js";

router.post("/create-checkout-session", guard, createCheckoutSession);
router.get("/checkout-success", checkoutSuccess);

export default router;
