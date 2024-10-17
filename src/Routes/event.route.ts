import express from "express";
const router = express.Router();

import {
  getAllEvents,
  createEvent,
  getOneEvent,
  updateEvent,
  deleteEvent,
} from "../Controllers/event.controller.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";

router.use(guard);

router
  .route("/")
  .get(getAllEvents)
  .post(allowedTo("ORGANIZER", "ADMIN"), createEvent);

router
  .route("/:id")
  .get(getOneEvent)
  .put(allowedTo("ORGANIZER", "ADMIN"), updateEvent)
  .delete(allowedTo("ORGANIZER", "ADMIN"), deleteEvent);

export default router;
