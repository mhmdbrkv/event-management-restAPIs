import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      filterObj?: {}; // Add user property
    }
  }
}

export const filterObj = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.params.categoryId) {
      req.filterObj = { where: { categoryId: req.params.categoryId } };
    } else if (req.params.organizerId) {
      req.filterObj = { where: { organizerId: req.params.organizerId } };
    } else if (req.params.userId) {
      req.filterObj = { where: { userId: req.params.userId } };
    } else if (req.params.eventId) {
      req.filterObj = { where: { eventId: req.params.eventId } };
    } else req.filterObj = {};
    next();
  } catch (error) {
    console.error(error);
    throw next(error);
  }
};
