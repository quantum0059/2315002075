import { createApp } from "./app";
import { configureContainer } from "./di/register";
import { config } from "./config";
import { logger } from "./utils/logger";
import { container } from "./di/container";
import { TYPES } from "./types/di";
import { NotificationQueueService } from "./queues/notification-queue";

configureContainer();

const queue = container.resolve<NotificationQueueService>(TYPES.NotificationQueueService);
queue.start();

const app = createApp();

app.listen(config.app.port, () => {
  logger.info("Notification backend started", {
    port: config.app.port,
    environment: config.app.env,
  });
});
