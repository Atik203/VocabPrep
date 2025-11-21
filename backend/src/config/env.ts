import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  DB_NAME: z.string().default("EnglishPrep"),
  API_BASE_PATH: z.string().default("/api/v1"),

  // AI Configuration
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
  AI_FREE_DAILY_LIMIT: z.coerce.number().default(100),
  AI_PREMIUM_DAILY_LIMIT: z.coerce.number().default(500),
  AI_MAX_TOKENS_PER_REQUEST: z.coerce.number().default(1000),
  AI_TIMEOUT_MS: z.coerce.number().default(30000),
});

export const env = envSchema.parse(process.env);
