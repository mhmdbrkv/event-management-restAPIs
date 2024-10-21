import { check } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";

export const uuidValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter id to search by")
    .isUUID()
    .withMessage("Invalid id format"),

  validatorMiddleware,
];

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name is required as a string")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name length must be between 3 and 32 character"),

  validatorMiddleware,
];

export const updateCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter id to search by")
    .isUUID()
    .withMessage("Invalid id format"),

  check("name")
    .optional()
    .isString()
    .withMessage("Category name is required as a string")
    .isLength({ min: 8, max: 32 })
    .withMessage("Category name length must be between 8 and 32 character"),
  validatorMiddleware,
];
