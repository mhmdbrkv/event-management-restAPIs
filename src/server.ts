import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import helmet from "helmet";

import mountRoutes from "./Routes/index.js";
import ApiError from "./Utils/apiError.js";
import errorMiddleware from "./Middleware/error.middleware.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5500;

// Configure CORS with specific options
const corsOptions = {
  origin: process.env.CLIENT_URL, // Allow a single origin
  credentials: true, // Allow cookies and HTTP authentication
};

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

app.use(express.json({ limit: "20kb" })); // allows you to parse the body of the request
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());

// use express-rate-limit
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: ["price", "sold", "quantity", "ratingsNumber", "avgRatings"],
  })
);

app.options("*", cors());

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
