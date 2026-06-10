export const TYPES = {
  NotificationRepository: "NotificationRepository",
  NotificationService: "NotificationService",
  NotificationController: "NotificationController",
  NotificationJobRepository: "NotificationJobRepository",
  UserPreferencesRepository: "UserPreferencesRepository",
  UserNotificationRepository: "UserNotificationRepository",
  NotificationQueueService: "NotificationQueueService",
} as const;

export type Token = (typeof TYPES)[keyof typeof TYPES];
