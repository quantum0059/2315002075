// Notification types
export type NotificationType = 'placement' | 'result' | 'event';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export type NotificationStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'expired' | 'cancelled';
export type DeliveryChannel = 'websocket' | 'email' | 'sms' | 'push' | 'in-app';

// Metadata types for different notification categories
export interface PlacementMetadata {
  company: string;
  position: string;
  deadline: string;
  eligibility?: {
    minCGPA: number;
    branches: string[];
    batch: number;
  };
}

export interface ResultMetadata {
  examName: string;
  semester: number;
  academicYear: string;
  resultUrl?: string;
}

export interface EventMetadata {
  eventName: string;
  location: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  maxParticipants?: number;
}

export type NotificationMetadata = PlacementMetadata | ResultMetadata | EventMetadata;

// Target audience
export interface TargetAudience {
  all: boolean;
  segments?: {
    branches?: string[];
    batches?: number[];
    roles?: string[];
  };
}

// Main Notification entity
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  metadata: NotificationMetadata;
  targetAudience: TargetAudience;
  scheduledAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// User Notification (inbox)
export interface UserNotification {
  id: string;
  userId: string;
  notificationId: string;
  read: boolean;
  readAt: string | null;
  delivered: boolean;
  deliveredAt: string | null;
  deliveryChannel: DeliveryChannel | null;
  createdAt: string;
}

// User Preferences
export interface PriorityFilter {
  enabled: boolean;
  channels: DeliveryChannel[];
  priorityFilter: NotificationPriority[];
}

export interface QuietHours {
  enabled: boolean;
  start: string; // Format: "HH:MM"
  end: string;   // Format: "HH:MM"
}

export interface NotificationPreferences {
  placement: PriorityFilter;
  result: PriorityFilter;
  event: PriorityFilter;
  quietHours: QuietHours;
}

export interface UserPreferences {
  id: string;
  userId: string;
  preferences: NotificationPreferences;
  createdAt: string;
  updatedAt: string;
}

// Delivery stats
export interface DeliveryStats {
  total: number;
  delivered: number;
  read: number;
  failed: number;
}

// Input types for repository
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
