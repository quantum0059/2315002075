import dotenv from "dotenv";

dotenv.config();

export interface AppEnv {
  NODE_ENV: string;
  PORT: number;
}

export const env: AppEnv = {
  NODE_ENV: process.env.NODE_ENV?.trim() || "development",
  PORT: Number(process.env.PORT ?? 4000),
};
