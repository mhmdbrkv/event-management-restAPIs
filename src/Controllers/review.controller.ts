import ApiError from "../Utils/apiError.js";
import { PrismaClient, Review } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
const Review = new PrismaClient().review;

export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allReviews = await Review.findMany(req.filterObj);

    res.status(200).json({
      status: "success",
      results: allReviews.length,
      data: allReviews,
    });
  } catch (error) {
    console.error("getAllReviews error", error);
    return next(new ApiError("getAllReviews", 500));
  }
};

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newReview = await Review.create({
      data: req.body as Review,
    });

    res.status(201).json({
      status: "success",
      message: "Review Created Successfuly",
      data: newReview,
    });
  } catch (error) {
    console.error("createReview error", error);
    return next(new ApiError("createReview", 500));
  }
};

export const getOneReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const review = await Review.findUnique({
      where: { id },
      include: {
        User: true,
        Event: true,
      },
    });

    if (!review) {
      throw next(new ApiError(`No review found with id ${id}`, 404));
    }

    res.status(200).json({ status: "success", data: review });
  } catch (error) {
    console.error("getOneReview error", error);
    return next(new ApiError("getOneReview", 500));
  }
};

export const updateReviewData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedReview = await Review.update({
      where: { id },
      data: req.body as Review,
    });
    res.status(200).json({
      status: "success",
      message: "Review Updated Successfuly",
      data: updatedReview,
    });
  } catch (error) {
    console.error("updateReview error", error);
    return next(new ApiError("updateReview", 500));
  }
};

export const removeReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await Review.delete({
      where: { id },
    });
    res.status(204).json({ status: "success" });
  } catch (error) {
    console.error("deleteReview error", error);
    return next(new ApiError("deleteReview", 500));
  }
};
