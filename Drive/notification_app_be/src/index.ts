import { createApp } from "./app";
import { configureContainer } from "./di/register";
import { config } from "./config";
import { logger } from "./utils/logger";

configureContainer();

const app = createApp();

app.listen(config.app.port, () => {
  logger.info("Notification backend started", {
    port: config.app.port,
    environment: config.app.env,
  });
});
