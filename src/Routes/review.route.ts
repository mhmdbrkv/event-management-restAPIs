import express from "express";
const router = express.Router();

import {
  getAllReviews,
  createReview,
  getOneReview,
  updateReviewData,
  removeReview,
} from "../Controllers/review.controller.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";

router.use(guard);

router.route("/").get(getAllReviews).post(allowedTo("Client"), createReview);

router
  .route("/:id")
  .get(getOneReview)
  .put(allowedTo("ADMIN", "Client"), updateReviewData)
  .delete(allowedTo("ADMIN", "Client"), removeReview);

export default router;
