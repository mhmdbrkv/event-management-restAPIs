import express from "express";
const router = express.Router();

import {
  getAllCategories,
  createCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
} from "../Controllers/category.controller.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";

router.use(guard);

router
  .route("/")
  .get(getAllCategories)
  .post(allowedTo("ADMIN"), createCategory);

router
  .route("/:id")
  .get(getOneCategory)
  .put(allowedTo("ADMIN"), updateCategory)
  .delete(allowedTo("ADMIN"), deleteCategory);

export default router;
