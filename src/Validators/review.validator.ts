import { body, check, param } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();
import ApiError from "../Utils/apiError.js";

export const createReviewValidator = [
  check("comment")
    .notEmpty()
    .withMessage("comment is required")
    .isLength({ min: 4 })
    .withMessage("comment must be at least 4 characters"),

  check("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),

  check("eventId")
    .notEmpty()
    .withMessage("eventId is required")
    .isUUID()
    .withMessage("Invalid eventId format")
    .custom((value, { req }) => {
      const event = Prisma.event.findUnique({ where: { id: value } });
      if (!event) {
        throw new ApiError(`Event not found with id: ${value}`, 404);
      }
      return true;
    }),

  body().custom(async (value, { req }) => {
    const review = await Prisma.review.findFirst({
      where: {
        userId: req.user.id,
        eventId: req.body.eventId,
      },
    });

    if (review) {
      throw new ApiError("You can only leave one review per product", 400);
    }
    req.body.userId = req.user.id;
    return true;
  }),
  validatorMiddleware,
];

export const updateReviewValidator = [
  param("id")
    .notEmpty()
    .withMessage("Enter id to search by")
    .isUUID()
    .withMessage("Invalid id format")
    .custom(async (value, { req }) => {
      const review = await Prisma.review.findFirst({
        where: {
          id: value,
          userId: req.user.id,
        },
      });
      if (!review) {
        throw new ApiError(
          `No review found with id: ${value} or this review is not yours`,
          404
        );
      }
      return true;
    }),

  check("comment")
    .optional()
    .isLength({ min: 4 })
    .withMessage("comment must be at least 4 characters"),

  check("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),

  validatorMiddleware,
];

export const getAllReviewsValidator = [
  check("eventId").optional().isUUID().withMessage("invalid event id format"),
  check("userId").optional().isUUID().withMessage("invalid user id format"),
  validatorMiddleware,
];

export const uuidValidator = [
  param("id")
    .notEmpty()
    .withMessage("Enter id to search by")
    .isUUID()
    .withMessage("Invalid id format")
    .custom(async (value, { req }) => {
      const review = await Prisma.review.findFirst({
        where: {
          id: value,
          userId: req.user.id,
        },
      });
      if (!review) {
        throw new ApiError(
          `No review found with id: ${value} or this review is not yours`,
          404
        );
      }
      return true;
    }),
  validatorMiddleware,
];
