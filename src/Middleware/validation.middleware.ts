import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import ApiError from "../Utils/apiError.js";

export default (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
