import bcrypt from "bcryptjs";
import ApiError from "../Utils/apiError.js";
import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
const User = new PrismaClient().user;

export const getLoggedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user as User;

    const user = await User.findUnique({
      where: { id },
      include: {
        Events: true,
        AttendEvent: true,
        Reviews: true,
        Tickets: true,
      },
    });

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    console.error("getLoggedUser error:", error);
    return next(new ApiError("Get Logged User error", 500));
  }
};

export const updateLoggedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, username, email, phoneNumber, password } = req.user as User;

    const emailExists = await User.findUnique({ where: { email } });

    if (emailExists) {
      throw new ApiError("User email is unavilable", 400);
    }

    const updatedUser = await User.update({
      where: { id },
      data: {
        username: req.body?.username || username,
        email: req.body?.email || email,
        phoneNumber: req.body?.phoneNumber || phoneNumber,
        password: password,
      },
    });

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("updateLoggedUser error:", error);
    return next(new ApiError("update Logged User error", 500));
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, username, email, phoneNumber, password } = req.user as User;
    const newPassword = await bcrypt.hash(req.body.newPassword, 10);
    await User.update({
      where: { id },
      data: {
        username: username,
        email: email,
        phoneNumber: phoneNumber,
        password: newPassword || password,
      },
    });

    res.status(200).json({
      status: "success",
      message: "User password changed successfully",
    });
  } catch (error) {
    console.error("changePassword error:", error);
    return next(new ApiError("change Password error", 500));
  }
};
