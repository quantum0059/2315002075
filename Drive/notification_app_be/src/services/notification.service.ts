import { Log } from "@notification/logging-middleware";
import { Notification, NotificationType } from "../types/domain";
import { NotificationRepository } from "../repositories/interfaces/notification-repository.interface";
import {
  NotificationFetchResult,
  NotificationListQuery,
  NotificationListResponse,
  NotificationService,
} from "./interfaces/notification-service.interface";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const VALID_TYPES: NotificationType[] = ["event", "result", "placement"];

export class NotificationServiceImpl implements NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  async getNotification(id: string): Promise<NotificationFetchResult> {
    await Log("backend", "info", "service", `NotificationService.getNotification called for id=${id}`);

    try {
      const notification = await this.repository.findById(id);

      if (!notification) {
        const message = `Notification not found for id=${id}`;
        await Log("backend", "warn", "service", message);
        return { data: null, error: message };
      }

      await Log("backend", "info", "service", `Notification fetched successfully id=${notification.id}`);
      return { data: notification };
    } catch (error) {
      const message = this.buildErrorMessage("getNotification", error);
      await Log("backend", "error", "service", message);
      return { data: null, error: message };
    }
  }

  async listNotifications(query: NotificationListQuery = {}): Promise<NotificationListResponse> {
    const page = query.page && query.page > 0 ? query.page : DEFAULT_PAGE;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : DEFAULT_PAGE_SIZE;
    const type = query.type && VALID_TYPES.includes(query.type) ? query.type : undefined;

    await Log(
      "backend",
      "info",
      "service",
      `NotificationService.listNotifications called page=${page} pageSize=${pageSize} type=${type ?? "all"}`
    );

    try {
      const queryPayload = { page, pageSize, type };
      const result = await this.repository.list(queryPayload);

      await Log(
        "backend",
        "info",
        "service",
        `Notification list fetched successfully items=${result.items.length}`
      );

      return {
        items: result.items,
        page,
        pageSize,
        total: result.total,
      };
    } catch (error) {
      const message = this.buildErrorMessage("listNotifications", error);
      await Log("backend", "error", "service", message);
      return { items: [], page, pageSize, total: 0, error: message };
    }
  }

  private buildErrorMessage(method: string, error: unknown): string {
    if (error instanceof Error) {
      return `NotificationService.${method} failed: ${error.message}`;
    }

    return `NotificationService.${method} failed with unexpected error: ${String(error)}`;
  }
}
