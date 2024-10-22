import { Express } from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import eventRoutes from "./event.route.js";
import categoryRoutes from "./category.route.js";
import reviewRoutes from "./review.route.js";
import ticketRoutes from "./ticket.route.js";
import paymentRoutes from "./payment.route.js";
import { guard } from "../Middleware/auth.middleware.js";

export default (app: Express) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/tickets", ticketRoutes);
  app.use("/api/payments", paymentRoutes);

  // Nested Route: Get All Events for Specific Category
  app.use("/api/categories/:categoryId/events", guard, eventRoutes);

  // Nested Route: Get All Events Created By Specific User
  app.use("/api/users/:organizerId/events", guard, eventRoutes);

  // Nested Route: Get All Reviews For Specific User
  app.use("/api/users/:userId/reviews", guard, reviewRoutes);

  // Nested Route: Get All Reviews For Specific Event
  app.use("/api/events/:eventId/reviews", guard, reviewRoutes);

  // Nested Route: Get All Tickets For Specific User
  app.use("/api/users/:userId/tickets", guard, ticketRoutes);

  // Nested Route: Get All Tickets For Specific Event
  app.use("/api/events/:eventId/tickets", guard, ticketRoutes);
};
