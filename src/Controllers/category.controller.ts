import ApiError from "../Utils/apiError.js";
import { PrismaClient, Category } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import redis from "../Utils/redis.js";
const Category = new PrismaClient().category;

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get stored categories from redis for quick access
    let cachedCategories = await redis.get("categories");

    if (cachedCategories) {
      res
        .status(200)
        .json({ status: "success", data: JSON.parse(cachedCategories) });
    } else {
      const allCategories = await Category.findMany({});

      // store in redis for quick access
      await redis.set("categories", JSON.stringify(allCategories));

      res.status(200).json({
        status: "success",
        results: allCategories.length,
        data: allCategories,
      });
    }
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
    const category = await Category.findUnique({
      where: { name: req.body.name },
    });

    if (category) {
      throw new ApiError(`Category already exists`, 400);
    }

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

    const category = await Category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new ApiError(`No category found with id: ${id}`, 400);
    }

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
