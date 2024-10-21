import { check } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import { PrismaClient } from "@prisma/client";
const User = new PrismaClient().user;
import ApiError from "../Utils/apiError.js";
import bcrypt from "bcryptjs";

export const updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter id to search by")
    .isUUID()
    .withMessage("Invalid id format"),

  check("username")
    .optional()
    .isString()
    .withMessage("username is required as a string")
    .isLength({ min: 3, max: 12 })
    .withMessage("User name length must be between 3 and 12 character"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("User email is required as a valid email format")
    .trim()
    .normalizeEmail(),

  check("password")
    .optional()
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

  check("phoneNumber").optional(),
  validatorMiddleware,
];

export const changePasswordValidator = [
  check("oldPassword")
    .notEmpty()
    .withMessage("User old password is required")
    .custom(async (value, { req }) => {
      const { id } = req.user;
      const user = await User.findUnique({ where: { id } });
      if (!user) throw new ApiError("No user found for this id", 404);

      const isMatch = await bcrypt.compare(value, user.password);
      if (!isMatch) return new ApiError("Enter the correct old password", 400);

      return true;
    }),

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
