import { Pool } from "pg";
import { config } from "./index";

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  max: config.db.poolSize,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
