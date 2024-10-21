import { check } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import ApiError from "../Utils/apiError.js";

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
    .withMessage("User email is required as a valid email format"),

  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 8 })
    .withMessage("User password length must be more than 8 characters")
    .custom(async (value, { req }) => {
      let regex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
      if (!regex.test(value)) {
        throw new ApiError(
          "Password must contain 8 characters and at least one number, one letter and one unique character such as !#$%&? ",
          400
        );
      }
      return true;
    }),

  check("phoneNumber").notEmpty().withMessage("User phoneNumber is required"),
  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email is required as a valid email format"),
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 8 })
    .withMessage("User password length must be more than 8 characters")
    .custom(async (value, { req }) => {
      let regex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
      if (!regex.test(value)) {
        throw new ApiError(
          "Password must contain 8 characters and at least one number, one letter and one unique character such as !#$%&? ",
          400
        );
      }
      return true;
    }),

  validatorMiddleware,
];

export const newPasswordValidator = [
  check("newPassword")
    .notEmpty()
    .withMessage("newPassword is required")
    .isLength({ min: 8 })
    .withMessage("Password length must be more than 8 characters")
    .custom(async (value, { req }) => {
      let regex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
      if (!regex.test(value)) {
        throw new ApiError(
          "Password must contain 8 characters and at least one number, one letter and one unique character such as !#$%&? ",
          400
        );
      }
      return true;
    }),

  validatorMiddleware,
];
