import { Router } from "express";
import { NotificationService } from "../services/interfaces/notification-service.interface";
import { Controller } from "./interfaces/controller.interface";

export class NotificationController implements Controller {
  private readonly router = Router();

  constructor(private readonly service: NotificationService) {}

  registerRoutes(): void {
    // Route registration will be added later.
  }

  getRouter(): Router {
    return this.router;
  }
}
