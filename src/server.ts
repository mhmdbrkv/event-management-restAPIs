import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import mountRoutes from "./Routes/index.js";
import ApiError from "./Utils/apiError.js";
import errorMiddleware from "./Middleware/error.middleware.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5500;

app.use(express.json());
app.use(cookieParser());

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError("Route not found", 404));
});

// Global Error Handling Inside Express
app.use(errorMiddleware);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port} ♥`);
});

// Handling Rejections Outside Express
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection at:", err.name, err.message);
  server.close(() => {
    console.error("Shuttinf Down...");
    process.exit(1);
  });
});
