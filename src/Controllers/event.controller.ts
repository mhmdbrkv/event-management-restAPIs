import ApiError from "../Utils/apiError.js";
import { PrismaClient, Event } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
const Event = new PrismaClient().event;

export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allEvents = await Event.findMany({});
    res.status(200).json({
      status: "success",
      results: allEvents.length,
      data: allEvents,
    });
  } catch (error) {
    console.error("getAllEvents error", error);
    return next(new ApiError("getAllEvents", 500));
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body.date = new Date(req.body.date).toISOString();
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
        User: true,
        Category: true,
        Review: true,
        Venue: true,
        Booking: true,
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
