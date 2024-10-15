import { Express } from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import eventRoutes from "./event.route.js";
// import categoryRoutes from "./category.route.js";

export default (app: Express) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/events", eventRoutes);
  // app.use("/api/categories", categoryRoutes);
};
