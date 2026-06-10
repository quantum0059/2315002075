export type NotificationType = 'event' | 'result' | 'placement';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
}
