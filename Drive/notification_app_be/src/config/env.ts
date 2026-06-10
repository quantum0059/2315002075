import dotenv from "dotenv";

dotenv.config();

export interface AppEnv {
  NODE_ENV: string;
  PORT: number;
  PGHOST: string;
  PGPORT: number;
  PGUSER: string;
  PGPASSWORD: string;
  PGDATABASE: string;
  PGPOOLSIZE: number;
}

export const env: AppEnv = {
  NODE_ENV: process.env.NODE_ENV?.trim() || "development",
  PORT: Number(process.env.PORT ?? 4000),
  PGHOST: process.env.PGHOST?.trim() || "localhost",
  PGPORT: Number(process.env.PGPORT ?? 5432),
  PGUSER: process.env.PGUSER?.trim() || "postgres",
  PGPASSWORD: process.env.PGPASSWORD?.trim() || "",
  PGDATABASE: process.env.PGDATABASE?.trim() || "notifications",
  PGPOOLSIZE: Number(process.env.PGPOOLSIZE ?? 10),
};
