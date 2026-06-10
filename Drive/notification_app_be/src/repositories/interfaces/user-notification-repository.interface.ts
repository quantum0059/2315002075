import { UserNotification } from "../../types/domain";

export interface UserNotificationListQuery {
  type?: string;
  read?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface UserNotificationRepository {
  findById(id: string): Promise<UserNotification | null>;
  findByUserId(userId: string, query?: UserNotificationListQuery): Promise<{ items: UserNotification[]; total: number; unreadCount: number }>;
  create(userId: string, notificationId: string, deliveryChannel?: string): Promise<UserNotification>;
  markAsDelivered(userId: string, notificationId: string, deliveryChannel?: string): Promise<void>;
  markAsRead(id: string): Promise<UserNotification>;
  markAllAsRead(userId: string): Promise<number>;
  remove(id: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}
