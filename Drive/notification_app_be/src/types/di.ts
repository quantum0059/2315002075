export const TYPES = {
  NotificationRepository: "NotificationRepository",
  NotificationService: "NotificationService",
  NotificationController: "NotificationController",
} as const;

export type Token = (typeof TYPES)[keyof typeof TYPES];
