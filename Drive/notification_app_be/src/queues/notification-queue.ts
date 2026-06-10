import { Notification } from "../types/domain";
import { NotificationJobChannel, NotificationJobPayload, NotificationJobCreateInput } from "../types/queue";
import { NotificationJobRepository } from "../repositories/interfaces/notification-job-repository.interface";
import { UserPreferencesRepository } from "../repositories/interfaces/user-preferences-repository.interface";
import { UserNotificationRepository } from "../repositories/interfaces/user-notification-repository.interface";
import { logger } from "../utils/logger";

const DEFAULT_BATCH_SIZE = 100;
const MAX_RETRY_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 60_000;
const POLL_INTERVAL_MS = 1000;

export class NotificationQueueService {
  private processing = false;

  constructor(
    private readonly jobRepository: NotificationJobRepository,
    private readonly preferencesRepository: UserPreferencesRepository,
    private readonly userNotificationRepository: UserNotificationRepository
  ) {}

  async enqueueDeliveryJobs(notification: Notification): Promise<void> {
    const userIds = notification.targetAudience.all
      ? await this.preferencesRepository.listAllUserIds()
      : [];

    if (userIds.length === 0) {
      logger.warn("NotificationQueueService.enqueueDeliveryJobs found no recipients", {
        notificationId: notification.id,
        targetAudience: notification.targetAudience,
      });
      return;
    }

    const jobs: NotificationJobCreateInput[] = [];

    for (const userId of userIds) {
      jobs.push({
        jobKey: `${notification.id}:${userId}:email`,
        notificationId: notification.id,
        userId,
        channel: "email",
        payload: this.buildPayload(notification),
        nextRunAt: notification.scheduledAt ? new Date(notification.scheduledAt) : new Date(),
      });

      jobs.push({
        jobKey: `${notification.id}:${userId}:in-app`,
        notificationId: notification.id,
        userId,
        channel: "in-app",
        payload: this.buildPayload(notification),
        nextRunAt: notification.scheduledAt ? new Date(notification.scheduledAt) : new Date(),
      });
    }

    await this.jobRepository.enqueueJobs(jobs);
    logger.info("NotificationQueueService.enqueueDeliveryJobs queued delivery jobs", {
      notificationId: notification.id,
      recipientCount: userIds.length,
      enqueuedJobs: jobs.length,
    });
  }

  start(): void {
    setInterval(() => {
      this.processPendingJobs().catch((error) => {
        logger.error("NotificationQueueService.processPendingJobs failed", { error: error instanceof Error ? error.message : String(error) });
      });
    }, POLL_INTERVAL_MS);
  }

  private async processPendingJobs(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;
    try {
      const jobs = await this.jobRepository.fetchPendingJobs(DEFAULT_BATCH_SIZE);
      for (const job of jobs) {
        await this.processJob(job);
      }
    } finally {
      this.processing = false;
    }
  }

  private async processJob(job: { id: string; jobKey: string; notificationId: string; userId: string; channel: NotificationJobChannel; payload: NotificationJobPayload; status: string; attempts: number; }): Promise<void> {
    try {
      if (job.channel === "email") {
        await this.sendEmail(job);
      } else {
        await this.deliverInApp(job);
      }
      await this.jobRepository.markAsCompleted(job.id);
      logger.info("NotificationQueueService.processJob completed", {
        jobId: job.id,
        channel: job.channel,
        userId: job.userId,
      });
    } catch (error) {
      const attemptCount = job.attempts + 1;
      const nextRunAt = attemptCount <= MAX_RETRY_ATTEMPTS ? this.computeBackoff(attemptCount) : null;
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.jobRepository.markAsFailed(job.id, errorMessage, nextRunAt, attemptCount);

      logger.warn("NotificationQueueService.processJob failed", {
        jobId: job.id,
        channel: job.channel,
        userId: job.userId,
        attemptCount,
        error: errorMessage,
      });
    }
  }

  private async sendEmail(job: { userId: string; notificationId: string; payload: NotificationJobPayload }): Promise<void> {
    logger.info("NotificationQueueService.sendEmail simulated", {
      userId: job.userId,
      notificationId: job.notificationId,
      subject: job.payload.title,
    });
    // Minimal placeholder for an email provider integration.
    return Promise.resolve();
  }

  private async deliverInApp(job: { userId: string; notificationId: string; payload: NotificationJobPayload }): Promise<void> {
    await this.userNotificationRepository.create(job.userId, job.notificationId, "in-app");
    await this.userNotificationRepository.markAsDelivered(job.userId, job.notificationId, "in-app");
  }

  private buildPayload(notification: Notification): NotificationJobPayload {
    return {
      title: notification.title,
      body: notification.body,
      priority: notification.priority,
      metadata: notification.metadata,
    };
  }

  private computeBackoff(attempts: number): Date {
    const delay = BASE_BACKOFF_MS * Math.pow(2, attempts - 1);
    return new Date(Date.now() + delay);
  }
}
