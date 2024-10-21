import express from "express";
const router = express.Router({ mergeParams: true });

import {
  getAllEvents,
  createEvent,
  getOneEvent,
  updateEvent,
  deleteEvent,
} from "../Controllers/event.controller.js";
import {
  uuidValidator,
  getAllEventsValidator,
  createEventValidator,
  updateEventValidator,
} from "../Validators/event.validator.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";
import { filterObj } from "../Middleware/nestedRoute.middleware.js";

router.use(guard);

router
  .route("/")
  .get(filterObj, getAllEventsValidator, getAllEvents)
  .post(allowedTo("ORGANIZER", "ADMIN"), createEventValidator, createEvent);

router
  .route("/:id")
  .get(uuidValidator, getOneEvent)
  .put(allowedTo("ORGANIZER", "ADMIN"), updateEventValidator, updateEvent)
  .delete(allowedTo("ORGANIZER", "ADMIN"), uuidValidator, deleteEvent);

export default router;
