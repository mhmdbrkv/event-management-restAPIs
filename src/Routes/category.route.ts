import express from "express";
const router = express.Router();

import {
  getAllCategories,
  createCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
} from "../Controllers/category.controller.js";

import {
  uuidValidator,
  createCategoryValidator,
  updateCategoryValidator,
} from "../Validators/category.validator.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";

router.use(guard);

router
  .route("/")
  .get(getAllCategories)
  .post(allowedTo("ADMIN"), createCategoryValidator, createCategory);

router
  .route("/:id")
  .get(uuidValidator, getOneCategory)
  .put(allowedTo("ADMIN"), updateCategoryValidator, updateCategory)
  .delete(allowedTo("ADMIN"), uuidValidator, deleteCategory);

export default router;
