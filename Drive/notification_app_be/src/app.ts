import cors from "cors";
import express, { Express } from "express";
import { config } from "./config";
import { createRoutes } from "./routes";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.set("env", config.app.env);

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.use("/api", createRoutes());
  app.use(errorHandler);

  return app;
}
