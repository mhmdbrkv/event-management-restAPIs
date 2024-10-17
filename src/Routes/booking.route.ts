import express from "express";
const router = express.Router();

import {
  getAllBookings,
  createBooking,
  getOneBooking,
  updateBookingData,
  removeBooking,
} from "../Controllers/booking.controller.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";

router.use(guard);

router
  .route("/")
  .get(allowedTo("ADMIN"), getAllBookings)
  .post(allowedTo("Client"), createBooking);

router
  .route("/:id")
  .get(getOneBooking)
  .put(allowedTo("ADMIN"), updateBookingData)
  .delete(allowedTo("ADMIN"), removeBooking);

export default router;
