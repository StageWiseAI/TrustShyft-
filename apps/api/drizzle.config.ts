import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/**/*.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://trustshyft:trustshyft@localhost:5432/trustshyft",
  },
  schemaFilter: ["app", "audit"],
  strict: true,
  verbose: true,
} satisfies Config;
