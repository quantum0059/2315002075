import { container } from "./container";
import { TYPES } from "../types/di";
import { NotificationRepositoryImpl } from "../repositories/notification.repository";
import { NotificationServiceImpl } from "../services/notification.service";
import { NotificationController } from "../controllers/notification.controller";

export function configureContainer(): void {
  container.register(TYPES.NotificationRepository, () => new NotificationRepositoryImpl());
  container.register(
    TYPES.NotificationService,
    () => new NotificationServiceImpl(container.resolve(TYPES.NotificationRepository)),
  );
  container.register(
    TYPES.NotificationController,
    () => new NotificationController(container.resolve(TYPES.NotificationService)),
  );
}
