import { Router } from "express";
const router = Router();

import { guard, allowedTo } from "../Middleware/auth.middleware.js";

import {
  getAllPayments,
  addPayment,
  getOnePayment,
  updatePaymentData,
  deletePayment,
} from "../Controllers/payment.controller.js";

router.use(guard, allowedTo("ADMIN"));

router.route("/").get(getAllPayments).post(addPayment);
router
  .route("/:id")
  .get(getOnePayment)
  .put(updatePaymentData)
  .delete(deletePayment);

export default router;
