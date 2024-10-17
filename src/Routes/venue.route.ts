import express from "express";
const router = express.Router();

import {
  getAllVenues,
  addVenue,
  getOneVenue,
  updateVenueData,
  removeVenue,
} from "../Controllers/venue.controller.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";

router.use(guard);

router
  .route("/")
  .get(allowedTo("ADMIN"), getAllVenues)
  .post(allowedTo("ADMIN", "ORGANIZER"), addVenue);

router
  .route("/:id")
  .get(getOneVenue)
  .put(allowedTo("ADMIN", "ORGANIZER"), updateVenueData)
  .delete(allowedTo("ADMIN", "ORGANIZER"), removeVenue);

export default router;
