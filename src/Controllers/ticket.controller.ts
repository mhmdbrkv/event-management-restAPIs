import ApiError from "../Utils/apiError.js";
import { PrismaClient, Ticket } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
const Prisma = new PrismaClient();

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newTicket = await Prisma.ticket.create({
      data: req.body as Ticket,
    });

    res.status(201).json({
      status: "success",
      message: "Ticket Created Successfuly",
      data: newTicket,
    });
  } catch (error) {
    console.error("createTicket error", error);
    return next(new ApiError("createTicket", 500));
  }
};

export const getAllTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allTickets = await Prisma.ticket.findMany(req.filterObj);

    res.status(200).json({
      status: "success",
      results: allTickets.length,
      data: allTickets,
    });
  } catch (error) {
    console.error("getAllTickets error", error);
    return next(new ApiError("getAllTickets", 500));
  }
};

export const getOneTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const ticket = await Prisma.ticket.findUnique({
      where: { id },
      include: { Event: true, User: true },
    });

    res.status(200).json({
      status: "success",
      data: ticket,
    });
  } catch (error) {
    console.error("getOneTicket error", error);
    return next(new ApiError("getOneTicket", 500));
  }
};

export const updateTicketData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedTicket = await Prisma.ticket.update({
      where: { id },
      data: req.body as Ticket,
    });
    res.status(200).json({
      status: "success",
      message: "Ticket Updated Successfuly",
      data: updatedTicket,
    });
  } catch (error) {
    console.error("updateTicket error", error);
    return next(new ApiError("updateTicket", 500));
  }
};

export const removeTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await Prisma.ticket.delete({
      where: { id },
    });
    res.status(204).json({ status: "success" });
  } catch (error) {
    console.error("deleteTicket error", error);
    return next(new ApiError("deleteTicket", 500));
  }
};
