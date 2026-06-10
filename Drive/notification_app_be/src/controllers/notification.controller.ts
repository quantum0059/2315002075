import { Request, Response, Router } from "express";
import {
  NotificationListQuery,
  NotificationService,
} from "../services/interfaces/notification-service.interface";
import { Controller } from "./interfaces/controller.interface";
import { logger } from "../utils/logger";
import { NotificationType } from "../types/domain";

const VALID_NOTIFICATION_TYPES: NotificationType[] = ["event", "result", "placement"];

export class NotificationController implements Controller {
  private readonly router = Router();

  constructor(private readonly service: NotificationService) {}

  registerRoutes(): void {
    this.router.get("/notifications", this.handleListNotifications.bind(this));
  }

  getRouter(): Router {
    return this.router;
  }

  private handleListNotifications(req: Request, res: Response): void {
    const requestMeta = {
      method: req.method,
      path: req.path,
      query: req.query,
    };

    logger.info("GET /notifications request started", requestMeta);

    const validationError = this.validateQueryParams(req.query);
    if (validationError) {
      logger.warn("GET /notifications request validation failed", {
        ...requestMeta,
        validationError,
      });

      res.status(400).json({
        success: false,
        error: validationError,
      });
      return;
    }

    const query = this.buildListQuery(req.query);

    this.service
      .listNotifications(query)
      .then((result) => {
        if (result.error) {
          logger.error("GET /notifications request failed", {
            ...requestMeta,
            serviceError: result.error,
          });

          res.status(502).json({
            success: false,
            error: result.error,
          });
          return;
        }

        const payload = {
          items: result.items,
          page: result.page,
          limit: result.pageSize,
          total: result.total,
        };

        logger.info("GET /notifications request succeeded", {
          ...requestMeta,
          page: result.page,
          limit: result.pageSize,
          total: result.total,
          itemCount: result.items.length,
        });

        res.status(200).json({
          success: true,
          data: payload,
        });
      })
      .catch((error) => {
        logger.error("GET /notifications request failed unexpectedly", {
          ...requestMeta,
          error: error instanceof Error ? error.message : String(error),
        });

        res.status(500).json({
          success: false,
          error: "Unable to fetch notifications.",
        });
      });
  }

  private validateQueryParams(query: Record<string, unknown>): string | null {
    const { limit, page, notification_type } = query as Record<string, unknown>;

    if (limit !== undefined) {
      const parsedLimit = this.parsePositiveInt(limit);
      if (parsedLimit === null) {
        return "Query parameter 'limit' must be a positive integer.";
      }
    }

    if (page !== undefined) {
      const parsedPage = this.parsePositiveInt(page);
      if (parsedPage === null) {
        return "Query parameter 'page' must be a positive integer.";
      }
    }

    if (notification_type !== undefined) {
      if (
        typeof notification_type !== "string" ||
        !VALID_NOTIFICATION_TYPES.includes(notification_type as NotificationType)
      ) {
        return `Query parameter 'notification_type' must be one of: ${VALID_NOTIFICATION_TYPES.join(", ")}.`;
      }
    }

    return null;
  }

  private buildListQuery(query: Record<string, unknown>): NotificationListQuery {
    const { limit, page, notification_type } = query as Record<string, unknown>;

    const parsedPage = this.parsePositiveInt(page) ?? 1;
    const parsedLimit = this.parsePositiveInt(limit) ?? 20;

    return {
      page: parsedPage,
      pageSize: parsedLimit,
      type:
        typeof notification_type === "string" &&
        VALID_NOTIFICATION_TYPES.includes(notification_type as NotificationType)
          ? (notification_type as NotificationType)
          : undefined,
    };
  }

  private parsePositiveInt(value: unknown): number | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value === "number") {
      return Number.isInteger(value) && value > 0 ? value : null;
    }

    if (typeof value !== "string") {
      return null;
    }

    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }
}
