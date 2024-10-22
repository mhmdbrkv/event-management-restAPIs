import { check } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";

export const signupValidator = [
  check("username")
    .notEmpty()
    .withMessage("username is required")
    .isString()
    .withMessage("username is required as a string")
    .isLength({ min: 3, max: 12 })
    .withMessage("User name length must be between 3 and 12 character"),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email is required as a valid email format")
    .trim()
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password isn't strong enough. It must contain at least 8 characters, including uppercase, lowercase, number, and special character."
    )
    .trim(), // Removes extra spaces

  check("phoneNumber").notEmpty().withMessage("User phoneNumber is required"),
  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email is required as a valid email format")
    .trim()
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password isn't strong enough. It must contain at least 8 characters, including uppercase, lowercase, number, and special character."
    )
    .trim(), // Removes extra spaces

  validatorMiddleware,
];

export const newPasswordValidator = [
  check("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password isn't strong enough. It must contain at least 8 characters, including uppercase, lowercase, number, and special character."
    )
    .trim(), // Removes extra spaces

  validatorMiddleware,
];
