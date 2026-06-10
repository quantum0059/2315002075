import { Notification } from "../../types/domain";

export interface NotificationService {
  getNotification(id: string): Promise<Notification | null>;
  listNotifications(): Promise<Notification[]>;
}
