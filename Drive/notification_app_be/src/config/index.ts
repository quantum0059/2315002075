import { env } from "./env";

export const config = {
  app: {
    port: env.PORT,
    env: env.NODE_ENV,
  },
};
