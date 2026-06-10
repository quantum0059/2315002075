import { container } from "./container";
import { TYPES } from "../types/di";
import { NotificationRepositoryImpl } from "../repositories/notification.repository";
import { NotificationJobRepositoryImpl } from "../repositories/notification-job.repository";
import { UserNotificationRepositoryImpl } from "../repositories/user-notification.repository";
import { UserPreferencesRepositoryImpl } from "../repositories/user-preferences.repository";
import { NotificationServiceImpl } from "../services/notification.service";
import { NotificationController } from "../controllers/notification.controller";
import { NotificationQueueService } from "../queues/notification-queue";

export function configureContainer(): void {
  container.register(TYPES.NotificationRepository, () => new NotificationRepositoryImpl());
  container.register(TYPES.NotificationJobRepository, () => new NotificationJobRepositoryImpl());
  container.register(TYPES.UserPreferencesRepository, () => new UserPreferencesRepositoryImpl());
  container.register(TYPES.UserNotificationRepository, () => new UserNotificationRepositoryImpl());

  container.register(
    TYPES.NotificationQueueService,
    () =>
      new NotificationQueueService(
        container.resolve(TYPES.NotificationJobRepository),
        container.resolve(TYPES.UserPreferencesRepository),
        container.resolve(TYPES.UserNotificationRepository),
      ),
  );

  container.register(
    TYPES.NotificationService,
    () =>
      new NotificationServiceImpl(
        container.resolve(TYPES.NotificationRepository),
        container.resolve(TYPES.NotificationQueueService),
      ),
  );

  container.register(
    TYPES.NotificationController,
    () => new NotificationController(container.resolve(TYPES.NotificationService)),
  );
}
