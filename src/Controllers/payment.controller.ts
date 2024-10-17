import ApiError from "../Utils/apiError.js";
import { PrismaClient, Payment } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
const Payment = new PrismaClient().payment;

export const getAllPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allPayments = await Payment.findMany({});

    res.status(200).json({
      status: "success",
      results: allPayments.length,
      data: allPayments,
    });
  } catch (error) {
    console.error("getAllPayments error", error);
    return next(new ApiError("getAllPayments", 500));
  }
};

export const addPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPayment = await Payment.create({
      data: req.body as Payment,
    });

    res.status(201).json({
      status: "success",
      message: "Payment Created Successfuly",
      data: newPayment,
    });
  } catch (error) {
    console.error("createPayment error", error);
    return next(new ApiError("createPayment", 500));
  }
};

export const getOnePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findUnique({
      where: { id },
      include: {
        User: true,
        Booking: true,
      },
    });

    res.status(200).json({ status: "success", data: payment });
  } catch (error) {
    console.error("getOnePayment error", error);
    return next(new ApiError("getOnePayment", 500));
  }
};

export const updatePaymentData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedPayment = await Payment.update({
      where: { id },
      data: req.body as Payment,
    });
    res.status(200).json({
      status: "success",
      message: "Payment Updated Successfuly",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("updatePayment error", error);
    return next(new ApiError("updatePayment", 500));
  }
};

export const deletePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await Payment.delete({
      where: { id },
    });
    res.status(204).json({ status: "success" });
  } catch (error) {
    console.error("deletePayment error", error);
    return next(new ApiError("deletePayment", 500));
  }
};
