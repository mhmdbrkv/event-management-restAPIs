import { Express } from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import eventRoutes from "./event.route.js";
import categoryRoutes from "./category.route.js";
import venueRoutes from "./venue.route.js";
import bookingRoutes from "./booking.route.js";
import reviewRoutes from "./review.route.js";
import paymentRoutes from "./payment.route.js";

export default (app: Express) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/venues", venueRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/payments", paymentRoutes);
};
