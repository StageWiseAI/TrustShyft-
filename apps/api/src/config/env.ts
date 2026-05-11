import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z
    .string()
    .default("postgres://trustshyft:trustshyft@localhost:5432/trustshyft"),
  CLERK_SECRET_KEY: z.string().optional().default(""),
  CLERK_PUBLISHABLE_KEY: z.string().optional().default(""),
  CLERK_JWT_ISSUER: z.string().optional().default(""),
  WEB_ORIGIN: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
export type Env = typeof env;
