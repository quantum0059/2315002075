import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    query: req.query,
  });
  next();
};
