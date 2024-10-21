import ApiError from "../Utils/apiError.js";
import { PrismaClient, Event } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import ApiFeatures from "../Utils/apiFeatures.js";
const Event = new PrismaClient().event;

export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Instantiate the ApiFeatures class and apply features
    const apiFeatures = new ApiFeatures(req.query);
    const { queryObj, pagination } = apiFeatures.applyFeatures(req.query);

    // Fetch total number of documents for pagination
    const numOfDocuments = await Event.count({
      where: queryObj.where,
    });

    // Fetch events based on the built query object
    const allEvents = await Event.findMany(queryObj);

    // Pagination result
    const paginationResults = {
      ...pagination,
      totalPages: 0,
      next: 0,
      prev: 0,
    };

    paginationResults.totalPages = Math.ceil(
      numOfDocuments / paginationResults.limit
    );
    if (paginationResults.currentPage < paginationResults.totalPages) {
      paginationResults.next = paginationResults.currentPage + 1;
    }
    if (paginationResults.currentPage > 1) {
      paginationResults.prev = paginationResults.currentPage - 1;
    }

    // Send response with event data
    res.status(200).json({
      status: "success",
      results: allEvents.length,
      paginationResults,
      data: allEvents,
    });
  } catch (error) {
    console.error("getAllEvents error", error);
    return next(new ApiError("Error fetching events", 500));
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newEvent = await Event.create({
      data: req.body as Event,
    });

    res.status(201).json({
      status: "success",
      message: "Event Created Successfuly",
      data: newEvent,
    });
  } catch (error) {
    console.error("createEvent error", error);
    return next(new ApiError("createEvent", 500));
  }
};

export const getOneEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const event = await Event.findUnique({
      where: { id },

      include: {
        Organizer: true,
        Category: true,
        Reviews: true,
        Attendees: true,
        Tickets: true,
      },
    });
    res.status(200).json({ status: "success", data: event });
  } catch (error) {
    console.error("getOneEvent error", error);
    return next(new ApiError("getOneEvent", 500));
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedEvent = await Event.update({
      where: { id },
      data: req.body as Event,
    });
    res.status(200).json({
      status: "success",
      message: "Event Updated Successfuly",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("updateEvent error", error);
    return next(new ApiError("updateEvent", 500));
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await Event.delete({
      where: { id },
    });
    res.status(204).json({ status: "success" });
  } catch (error) {
    console.error("deleteEvent error", error);
    return next(new ApiError("deleteEvent", 500));
  }
};
