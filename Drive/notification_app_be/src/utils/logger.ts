import { Log } from "@notification/logging-middleware";

function buildMessage(message: string, meta?: Record<string, unknown>): string {
  return meta && Object.keys(meta).length
    ? `${message} | ${JSON.stringify(meta)}`
    : message;
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>): void => {
    void Log("backend", "info", "service", buildMessage(message, meta));
  },

  warn: (message: string, meta?: Record<string, unknown>): void => {
    void Log("backend", "warn", "service", buildMessage(message, meta));
  },

  error: (message: string, meta?: Record<string, unknown>): void => {
    void Log("backend", "error", "service", buildMessage(message, meta));
  },
};
