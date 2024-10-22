import { body, check, param } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();
import ApiError from "../Utils/apiError.js";

export const uuidValidator = [
  param("id")
    .notEmpty()
    .withMessage("Enter id to search by")
    .isUUID()
    .withMessage("Invalid id format")
    .custom(async (value, { req }) => {
      const event = await Prisma.event.findFirst({
        where: { id: value },
      });
      if (!event) {
        throw new ApiError(`No event found with id: ${value}`, 404);
      }
      return true;
    }),
  validatorMiddleware,
];

export const createEventValidator = [
  check("title")
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 8 })
    .withMessage("title must be at least 8 characters"),

  check("description")
    .notEmpty()
    .withMessage("description is required")
    .isLength({ min: 32 })
    .withMessage("title must be at least 32 characters"),

  check("city")
    .notEmpty()
    .withMessage("City is required")
    .isAlpha("en-US", { ignore: " " }) // Allows alphabets and spaces
    .withMessage("City name must contain only letters and spaces"),

  check("location")
    .notEmpty()
    .withMessage("Location is required")
    .isURL()
    .withMessage("Location must be a valid URL")
    .custom((value) => {
      // Check if the URL is a valid Google Maps link (full or shortened)
      const googleMapsRegex =
        /^(https:\/\/)?(www\.)?(google\.[a-z]+\/maps|maps\.app\.goo\.gl)/;
      if (!googleMapsRegex.test(value)) {
        throw new ApiError("Location must be a valid Google Maps link", 400);
      }
      return true;
    }),

  check("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1, max: 24 }) // Ensure it's an integer between 1 and 24
    .withMessage("Duration must be a number of hours between 1 and 24"),

  check("startHour")
    .notEmpty()
    .withMessage("Start hour is required")
    .matches(/^([1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i) // Validate correct time format
    .withMessage("Invalid startHour format. The format should be 'HH:MM AM/PM'")
    .custom((value) => {
      const [time, period] = value.split(" ");
      const [hour, minute] = time.split(":").map(Number);

      if (hour < 1 || hour > 12) {
        throw new ApiError(`Hour must be between 1 and 12`, 400);
      }
      if (minute < 0 || minute >= 60) {
        throw new ApiError(`Minutes must be between 00 and 59`, 400);
      }
      if (!["AM", "PM"].includes(period.toUpperCase())) {
        throw new ApiError(`Invalid period. Must be either 'AM' or 'PM'`, 400);
      }
      return true;
    }),

  check("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be in a valid ISO 8601 format (e.g., YYYY-MM-DD)"),

  check("ticketsQuantity")
    .notEmpty()
    .withMessage("ticketsQuantity is required")
    .isInt({ min: 1 })
    .withMessage("ticketsQuantity value must be a number greater than 0"),

  check("organizerId")
    .optional()
    .isUUID()
    .withMessage("Invalid organizerId format")
    .custom(async (value, { req }) => {
      const user = await Prisma.user.findUnique({ where: { id: value } });
      if (!user) {
        throw new ApiError(`user not found with id: ${value}`, 404);
      }

      if (user.role === "USER") {
        throw new ApiError(
          `organizerId dosen't belong to admin or organizer`,
          401
        );
      }

      return true;
    }),

  check("categoryId")
    .notEmpty()
    .withMessage("categoryId is required")
    .isUUID()
    .withMessage("Invalid categoryId format")
    .custom(async (value, { req }) => {
      const category = await Prisma.category.findUnique({
        where: { id: value },
      });
      if (!category) {
        throw new ApiError(`category not found with id: ${value}`, 404);
      }
      return true;
    }),

  validatorMiddleware,
];

export const updateEventValidator = [
  param("id")
    .notEmpty()
    .withMessage("Enter id to search by")
    .isUUID()
    .withMessage("Invalid id format"),

  check("title")
    .optional()
    .isLength({ min: 8 })
    .withMessage("title must be at least 8 characters"),

  check("description")
    .optional()
    .isLength({ min: 32 })
    .withMessage("title must be at least 32 characters"),

  check("city")
    .optional()
    .isAlpha("en-US", { ignore: " " }) // Allows alphabets and spaces
    .withMessage("City name must contain only letters and spaces"),

  check("location")
    .optional()
    .isURL()
    .withMessage("Location must be a valid URL")
    .custom((value) => {
      // Check if the URL is a valid Google Maps link
      const googleMapsRegex = /^(https:\/\/)?(www\.)?google\.[a-z]+\/maps/;
      if (!googleMapsRegex.test(value)) {
        throw new ApiError("Location must be a valid Google Maps link", 400);
      }
      return true;
    }),

  check("duration")
    .optional()
    .isInt({ min: 1, max: 24 }) // Ensure it's an integer between 1 and 24
    .withMessage("Duration must be a number of hours between 1 and 24"),

  check("startHour")
    .optional()
    .matches(/^([1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i) // Validate correct time format
    .withMessage("Invalid startHour format. The format should be 'HH:MM AM/PM'")
    .custom((value) => {
      const [time, period] = value.split(" ");
      const [hour, minute] = time.split(":").map(Number);

      if (hour < 1 || hour > 12) {
        throw new ApiError(`Hour must be between 1 and 12`, 400);
      }
      if (minute < 0 || minute >= 60) {
        throw new ApiError(`Minutes must be between 00 and 59`, 400);
      }
      if (!["AM", "PM"].includes(period.toUpperCase())) {
        throw new ApiError(`Invalid period. Must be either 'AM' or 'PM'`, 400);
      }
      return true;
    }),

  check("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be in a valid ISO 8601 format (e.g., YYYY-MM-DD)"),

  check("ticketsQuantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ticketsQuantity value must be a number greater than 0"),

  check("categoryId")
    .optional()
    .isUUID()
    .withMessage("Invalid categoryId format")
    .custom(async (value, { req }) => {
      const category = await Prisma.category.findUnique({
        where: { id: value },
      });
      if (!category) {
        throw new ApiError(`category not found with id: ${value}`, 404);
      }
      return true;
    }),

  validatorMiddleware,
];

export const getAllEventsValidator = [
  check("organizerId")
    .optional()
    .isUUID()
    .withMessage("invalid organizer id format"),
  check("categoryId")
    .optional()
    .isUUID()
    .withMessage("invalid category id format"),
  validatorMiddleware,
];
