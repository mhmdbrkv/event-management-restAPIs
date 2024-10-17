import ApiError from "../Utils/apiError.js";
import { PrismaClient, Category } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
const Category = new PrismaClient().category;

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allCategories = await Category.findMany({});

    res.status(200).json({
      status: "success",
      results: allCategories.length,
      data: allCategories,
    });
  } catch (error) {
    console.error("getAllCategories error", error);
    return next(new ApiError("getAllCategories", 500));
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newCategory = await Category.create({
      data: req.body as Category,
    });

    res.status(201).json({
      status: "success",
      message: "Category Created Successfuly",
      data: newCategory,
    });
  } catch (error) {
    console.error("createCategory error", error);
    return next(new ApiError("createCategory", 500));
  }
};

export const getOneCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const category = await Category.findUnique({
      where: { id },
      include: {
        Events: true,
      },
    });
    res.status(200).json({ status: "success", data: category });
  } catch (error) {
    console.error("getOneCategory error", error);
    return next(new ApiError("getOneCategory", 500));
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedCategory = await Category.update({
      where: { id },
      data: req.body as Category,
    });
    res.status(200).json({
      status: "success",
      message: "Category Updated Successfuly",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("updateCategory error", error);
    return next(new ApiError("updateCategory", 500));
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await Category.delete({
      where: { id },
    });
    res.status(204).json({ status: "success" });
  } catch (error) {
    console.error("deleteCategory error", error);
    return next(new ApiError("deleteCategory", 500));
  }
};
