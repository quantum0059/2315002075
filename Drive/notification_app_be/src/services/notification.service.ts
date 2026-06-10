import { Log } from "@notification/logging-middleware";
import {
  Notification,
  NotificationType,
} from "../types/domain";
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
  private readonly externalApiBaseUrl: string;

  constructor(private readonly repository: NotificationRepository) {
    this.externalApiBaseUrl = (process.env.NOTIFICATION_API_BASE_URL ?? "").replace(/\/+$/, "");
  }

  async getNotification(id: string): Promise<NotificationFetchResult> {
    await Log("backend", "info", "service", `NotificationService.getNotification called for id=${id}`);

    if (!this.externalApiBaseUrl) {
      const error = "Notification API base URL is not configured.";
      await Log("backend", "error", "service", error);
      return { data: null, error };
    }

    try {
      const response = await this.makeRequest<unknown>(`/notifications/${encodeURIComponent(id)}`);
      const notification = this.normalizeNotification(response);
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

    if (!this.externalApiBaseUrl) {
      const error = "Notification API base URL is not configured.";
      await Log("backend", "error", "service", error);
      return { items: [], page, pageSize, total: 0, error };
    }

    try {
      const queryString = this.buildQueryString({ page, pageSize, type });
      const response = await this.makeRequest<unknown>(`/notifications${queryString}`);
      const normalized = this.normalizeListResponse(response, page, pageSize);
      await Log("backend", "info", "service", `Notification list fetched successfully items=${normalized.items.length}`);
      return normalized;
    } catch (error) {
      const message = this.buildErrorMessage("listNotifications", error);
      await Log("backend", "error", "service", message);
      return { items: [], page, pageSize, total: 0, error: message };
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.externalApiBaseUrl}${endpoint}`;
    const fetchFn = (globalThis as any).fetch as (
      input: string,
      init?: { method?: string; headers?: Record<string, string> }
    ) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown>; statusText: string }>;

    if (typeof fetchFn !== "function") {
      throw new Error("Global fetch is not available in the runtime.");
    }

    const response = await fetchFn(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const body = await response.json();

    if (!response.ok) {
      const errorMessage = `External notification API request failed: ${response.status} ${response.statusText}`;
      throw new Error(`${errorMessage} - ${JSON.stringify(body)}`);
    }

    return body as T;
  }

  private buildQueryString(query: {
    page: number;
    pageSize: number;
    type?: NotificationType;
  }): string {
    const params: string[] = [];

    params.push(`page=${encodeURIComponent(String(query.page))}`);
    params.push(`pageSize=${encodeURIComponent(String(query.pageSize))}`);

    if (query.type) {
      params.push(`type=${encodeURIComponent(query.type)}`);
    }

    return params.length > 0 ? `?${params.join("&")}` : "";
  }

  private normalizeListResponse(payload: unknown, page: number, pageSize: number): NotificationListResponse {
    const rawItems: unknown[] = Array.isArray(payload)
      ? payload
      : payload && typeof payload === "object" && "items" in payload && Array.isArray((payload as any).items)
      ? (payload as any).items
      : [];

    const items = rawItems.map((item: unknown) => this.normalizeNotification(item));
    const total =
      payload && typeof payload === "object" && typeof (payload as any).total === "number"
        ? (payload as any).total
        : items.length;

    return { items, page, pageSize, total };
  }

  private normalizeNotification(payload: unknown): Notification {
    if (!payload || typeof payload !== "object") {
      throw new Error("Notification payload has invalid shape.");
    }

    const raw = payload as Record<string, unknown>;
    const id = typeof raw.id === "string" ? raw.id : String(raw.id ?? "");
    const message = typeof raw.message === "string" ? raw.message : String(raw.message ?? "");
    const timestamp =
      typeof raw.timestamp === "string"
        ? raw.timestamp
        : typeof raw.createdAt === "string"
        ? raw.createdAt
        : undefined;
    const typeValue = this.parseNotificationType(raw.type as unknown);

    if (!id || !message || !timestamp || !typeValue) {
      throw new Error("Notification payload is missing one or more required fields.");
    }

    return {
      id,
      type: typeValue,
      message,
      timestamp,
    };
  }

  private parseNotificationType(value: unknown): NotificationType | null {
    if (typeof value !== "string") {
      return null;
    }

    const normalized = value.trim().toLowerCase();
    return VALID_TYPES.includes(normalized as NotificationType) ? (normalized as NotificationType) : null;
  }

  private buildErrorMessage(method: string, error: unknown): string {
    if (error instanceof Error) {
      return `NotificationService.${method} failed: ${error.message}`;
    }

    return `NotificationService.${method} failed with unexpected error: ${String(error)}`;
  }
}
