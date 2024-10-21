import express from "express";
const router = express.Router({ mergeParams: true });

import {
  getAllReviews,
  createReview,
  getOneReview,
  updateReviewData,
  removeReview,
} from "../Controllers/review.controller.js";
import {
  uuidValidator,
  getAllReviewsValidator,
  createReviewValidator,
  updateReviewValidator,
} from "../Validators/review.validator.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";
import { filterObj } from "../Middleware/nestedRoute.middleware.js";

router.use(guard);

router
  .route("/")
  .get(filterObj, getAllReviewsValidator, getAllReviews)
  .post(allowedTo("USER"), createReviewValidator, createReview);

router
  .route("/:id")
  .get(allowedTo("ADMIN"), uuidValidator, getOneReview)
  .put(allowedTo("USER"), updateReviewValidator, updateReviewData)
  .delete(allowedTo("ADMIN", "USER"), uuidValidator, removeReview);

export default router;
