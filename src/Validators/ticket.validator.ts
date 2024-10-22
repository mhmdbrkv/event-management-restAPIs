import { check, param } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import { PrismaClient } from "@prisma/client";
import ApiError from "../Utils/apiError.js";
const Ticket = new PrismaClient().ticket;

export const uuidValidator = [
  param("id")
    .notEmpty()
    .withMessage("Enter id to search by")
    .isUUID()
    .withMessage("Invalid id format")
    .custom(async (value, { req }) => {
      const ticket = await Ticket.findFirst({
        where: {
          id: value,
        },
      });
      if (!ticket) {
        throw new ApiError(
          `No ticket found with id: ${value} or this ticket is not yours`,
          404
        );
      }
      return true;
    }),
  validatorMiddleware,
];

export const getAllTicketsValidator = [
  check("eventId").optional().isUUID().withMessage("invalid event id format"),
  check("userId").optional().isUUID().withMessage("invalid user id format"),
  validatorMiddleware,
];

export const createTicketValidator = [
  check("type")
    .notEmpty()
    .withMessage("Ticket type is required")
    .custom(async (value, { req }) => {
      if (!["GENERAL_ADMISSION", "VIP", "RESERVED_SEATING"].includes(value)) {
        throw new ApiError(
          `Ticket type not found. Available types: ["GENERAL_ADMISSION", "VIP", "RESERVED_SEATING"]`,
          404
        );
      }
      const ticket = await Ticket.findFirst({
        where: {
          type: value,
          eventId: req.body.eventId,
        },
      });

      if (ticket) {
        throw new ApiError(`Ticket already exists with the same type`, 404);
      }

      return true;
    }),

  check("price").notEmpty().withMessage("Ticket price is required"),

  check("eventId")
    .notEmpty()
    .withMessage("eventId is required")
    .isUUID()
    .withMessage("invalid event id format"),

  check("userId").optional().isUUID().withMessage("invalid user id format"),

  validatorMiddleware,
];

export const updateTicketValidator = [
  check("type")
    .optional()
    .custom((value) => {
      if (!["GENERAL_ADMISSION", "VIP", "RESERVED_SEATING"].includes(value)) {
        throw new ApiError(
          `Ticket type not found. Available types: ["GENERAL_ADMISSION", "VIP", "RESERVED_SEATING"]`,
          404
        );
      }
      return true;
    }),

  check("price").optional(),

  check("eventId").optional().isUUID().withMessage("invalid event id format"),

  check("userId").optional().isUUID().withMessage("invalid user id format"),

  validatorMiddleware,
];
