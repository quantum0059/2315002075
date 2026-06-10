import { Notification, NotificationType, NotificationPriority, NotificationStatus } from "../../types/domain";

export interface NotificationListQuery {
  type?: NotificationType;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'scheduledAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
  from?: string;
  to?: string;
}

export interface NotificationCreateInput {
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  metadata: object;
  targetAudience: {
    all: boolean;
    segments?: {
      branches?: string[];
      batches?: number[];
      roles?: string[];
    };
  };
  scheduledAt?: string | null;
  expiresAt?: string | null;
  createdBy: string;
}

export interface NotificationUpdateInput {
  title?: string;
  body?: string;
  priority?: NotificationPriority;
  metadata?: object;
  targetAudience?: object;
  scheduledAt?: string | null;
  expiresAt?: string | null;
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
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  error?: string;
}

export interface NotificationService {
  createNotification(input: NotificationCreateInput): Promise<Notification>;
  getNotification(id: string): Promise<NotificationFetchResult>;
  updateNotification(id: string, input: NotificationUpdateInput): Promise<Notification>;
  deleteNotification(id: string): Promise<void>;
  listNotifications(query?: NotificationListQuery): Promise<NotificationListResponse>;
}
