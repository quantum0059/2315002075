import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.error("Unhandled exception", {
    error: err.message,
    path: req.path,
  });

  res.status(500).json({
    error: "Internal server error",
  });

  next();
};
