import { env } from "./env";

export const config = {
  app: {
    port: env.PORT,
    env: env.NODE_ENV,
  },
  db: {
    host: env.PGHOST,
    port: env.PGPORT,
    user: env.PGUSER,
    password: env.PGPASSWORD,
    database: env.PGDATABASE,
    poolSize: env.PGPOOLSIZE,
  },
};
