import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../types/di";
import { NotificationController } from "../controllers/notification.controller";

export function createRoutes(): Router {
  const router = Router();
  const notificationController = container.resolve<NotificationController>(TYPES.NotificationController);

  notificationController.registerRoutes();
  router.use("/", notificationController.getRouter());

  return router;
}
