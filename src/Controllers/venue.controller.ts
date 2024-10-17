import ApiError from "../Utils/apiError.js";
import { PrismaClient, Venue } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
const Venue = new PrismaClient().venue;

export const getAllVenues = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allVenues = await Venue.findMany({});

    res.status(200).json({
      status: "success",
      results: allVenues.length,
      data: allVenues,
    });
  } catch (error) {
    console.error("getAllVenues error", error);
    return next(new ApiError("getAllVenues", 500));
  }
};

export const addVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newVenue = await Venue.create({
      data: req.body as Venue,
    });

    res.status(201).json({
      status: "success",
      message: "Venue Created Successfuly",
      data: newVenue,
    });
  } catch (error) {
    console.error("createVenue error", error);
    return next(new ApiError("createVenue", 500));
  }
};

export const getOneVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const venue = await Venue.findUnique({
      where: { id },
      include: {
        Events: true,
      },
    });
    res.status(200).json({ status: "success", data: venue });
  } catch (error) {
    console.error("getOneVenue error", error);
    return next(new ApiError("getOneVenue", 500));
  }
};

export const updateVenueData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedVenue = await Venue.update({
      where: { id },
      data: req.body as Venue,
    });
    res.status(200).json({
      status: "success",
      message: "Venue Updated Successfuly",
      data: updatedVenue,
    });
  } catch (error) {
    console.error("updateVenue error", error);
    return next(new ApiError("updateVenue", 500));
  }
};

export const removeVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await Venue.delete({
      where: { id },
    });
    res.status(204).json({ status: "success" });
  } catch (error) {
    console.error("deleteVenue error", error);
    return next(new ApiError("deleteVenue", 500));
  }
};
