import { pool } from "../config/database";
import { NotificationJobRepository } from "./interfaces/notification-job-repository.interface";
import { NotificationJob, NotificationJobCreateInput } from "../types/queue";

const BATCH_SIZE = 200;

export class NotificationJobRepositoryImpl implements NotificationJobRepository {
  async enqueueJobs(jobs: NotificationJobCreateInput[]): Promise<void> {
    if (jobs.length === 0) {
      return;
    }

    const chunks = this.chunk(jobs, BATCH_SIZE);

    for (const chunk of chunks) {
      const values: unknown[] = [];
      const placeholders = chunk
        .map((job, index) => {
          const base = index * 7;
          values.push(
            job.jobKey,
            job.notificationId,
            job.userId,
            job.channel,
            JSON.stringify(job.payload),
            job.nextRunAt ? job.nextRunAt.toISOString() : new Date().toISOString(),
            new Date().toISOString()
          );
          return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`;
        })
        .join(",");

      await pool.query(
        `INSERT INTO notification_jobs
          (job_key, notification_id, user_id, channel, payload, next_run_at, created_at)
         VALUES ${placeholders}
         ON CONFLICT (job_key) DO NOTHING`,
        values
      );
    }
  }

  async fetchPendingJobs(limit = 50): Promise<NotificationJob[]> {
    const result = await pool.query<NotificationJobRow>(
      `SELECT id, job_key, notification_id, user_id, channel, payload, status, attempts,
              last_error, next_run_at, created_at, updated_at
       FROM notification_jobs
       WHERE status IN ('pending', 'retrying')
         AND next_run_at <= NOW()
       ORDER BY next_run_at ASC, created_at ASC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map((row) => this.toNotificationJob(row));
  }

  async markAsCompleted(jobId: string): Promise<void> {
    await pool.query(
      `UPDATE notification_jobs
       SET status = 'completed', updated_at = NOW()
       WHERE id = $1`,
      [jobId]
    );
  }

  async markAsFailed(jobId: string, error: string, nextRunAt: Date | null, attempts: number): Promise<void> {
    await pool.query(
      `UPDATE notification_jobs
       SET status = CASE WHEN $4 >= 3 THEN 'failed' ELSE 'retrying' END,
           last_error = $2,
           attempts = $4,
           next_run_at = COALESCE($3, NOW() + INTERVAL '1 minute'),
           updated_at = NOW()
       WHERE id = $1`,
      [jobId, error, nextRunAt, attempts]
    );
  }

  private chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }
    return chunks;
  }

  private toNotificationJob(row: NotificationJobRow): NotificationJob {
    return {
      id: row.id,
      jobKey: row.job_key,
      notificationId: row.notification_id,
      userId: row.user_id,
      channel: row.channel as NotificationJob['channel'],
      payload: typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload,
      status: row.status as NotificationJob['status'],
      attempts: row.attempts,
      lastError: row.last_error,
      nextRunAt: row.next_run_at instanceof Date ? row.next_run_at.toISOString() : String(row.next_run_at),
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    };
  }
}

interface NotificationJobRow {
  id: string;
  job_key: string;
  notification_id: string;
  user_id: string;
  channel: string;
  payload: object | string;
  status: string;
  attempts: number;
  last_error: string | null;
  next_run_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
}
