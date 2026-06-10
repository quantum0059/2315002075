import { NotificationJob, NotificationJobCreateInput } from "../../types/queue";

export interface NotificationJobRepository {
  enqueueJobs(jobs: NotificationJobCreateInput[]): Promise<void>;
  fetchPendingJobs(limit?: number): Promise<NotificationJob[]>;
  markAsCompleted(jobId: string): Promise<void>;
  markAsFailed(jobId: string, error: string, nextRunAt: Date | null, attempts: number): Promise<void>;
}
