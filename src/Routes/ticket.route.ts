import { Router } from "express";
const router = Router({ mergeParams: true });

import { guard, allowedTo } from "../Middleware/auth.middleware.js";

import {
  getAllTickets,
  getOneTicket,
  createTicket,
  updateTicketData,
  removeTicket,
} from "../Controllers/ticket.controller.js";
import {
  uuidValidator,
  createTicketValidator,
  getAllTicketsValidator,
  updateTicketValidator,
} from "../Validators/ticket.validator.js";
import { filterObj } from "../Middleware/nestedRoute.middleware.js";

router.use(guard, allowedTo("ADMIN"));

// Ticket Payments
router
  .route("/")
  .get(filterObj, getAllTicketsValidator, getAllTickets)
  .post(createTicketValidator, createTicket);
router
  .route("/:id")
  .get(uuidValidator, getOneTicket)
  .put(updateTicketValidator, updateTicketData)
  .delete(uuidValidator, removeTicket);

export default router;
