import { NotificationMetadata, NotificationPriority } from "./domain";

export type NotificationJobChannel = "email" | "in-app";

export interface NotificationJobPayload {
  title: string;
  body: string;
  priority: NotificationPriority;
  metadata: NotificationMetadata;
}

export interface NotificationJob {
  id: string;
  jobKey: string;
  notificationId: string;
  userId: string;
  channel: NotificationJobChannel;
  payload: NotificationJobPayload;
  status: "pending" | "retrying" | "completed" | "failed";
  attempts: number;
  lastError: string | null;
  nextRunAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationJobCreateInput {
  jobKey: string;
  notificationId: string;
  userId: string;
  channel: NotificationJobChannel;
  payload: NotificationJobPayload;
  nextRunAt?: Date;
}
