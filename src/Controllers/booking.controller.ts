import ApiError from "../Utils/apiError.js";
import { PrismaClient, Booking } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
const Booking = new PrismaClient().booking;

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allBookings = await Booking.findMany({});

    res.status(200).json({
      status: "success",
      results: allBookings.length,
      data: allBookings,
    });
  } catch (error) {
    console.error("getAllBookings error", error);
    return next(new ApiError("getAllBookings", 500));
  }
};

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newBooking = await Booking.create({
      data: req.body as Booking,
    });

    res.status(201).json({
      status: "success",
      message: "Booking Created Successfuly",
      data: newBooking,
    });
  } catch (error) {
    console.error("createBooking error", error);
    return next(new ApiError("createBooking", 500));
  }
};

export const getOneBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findUnique({
      where: { id },
      include: {
        User: true,
        Event: true,
        Payment: true,
      },
    });

    res.status(200).json({ status: "success", data: booking });
  } catch (error) {
    console.error("getOneBooking error", error);
    return next(new ApiError("getOneBooking", 500));
  }
};

export const updateBookingData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedBooking = await Booking.update({
      where: { id },
      data: req.body as Booking,
    });
    res.status(200).json({
      status: "success",
      message: "Booking Updated Successfuly",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("updateBooking error", error);
    return next(new ApiError("updateBooking", 500));
  }
};

export const removeBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await Booking.delete({
      where: { id },
    });
    res.status(204).json({ status: "success" });
  } catch (error) {
    console.error("deleteBooking error", error);
    return next(new ApiError("deleteBooking", 500));
  }
};
