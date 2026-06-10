import { Notification, NotificationType } from "../../types/domain";

export interface NotificationListQuery {
  page?: number;
  pageSize?: number;
  type?: NotificationType;
}

export interface NotificationFetchResult {
  data: Notification | null;
  error?: string;
}

export interface NotificationListResponse {
  items: Notification[];
  page: number;
  pageSize: number;
  total: number;
  error?: string;
}

export interface NotificationService {
  getNotification(id: string): Promise<NotificationFetchResult>;
  listNotifications(query?: NotificationListQuery): Promise<NotificationListResponse>;
}
