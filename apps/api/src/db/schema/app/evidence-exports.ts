import { uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { appSchema, organisations } from "./organisations.js";
import { users } from "./users.js";

export const evidenceExports = appSchema.table(
  "evidence_exports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organisation_id: uuid("organisation_id")
      .notNull()
      .references(() => organisations.id, { onDelete: "cascade" }),
    requested_by_user_id: uuid("requested_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    range_start: timestamp("range_start", { withTimezone: true }).notNull(),
    range_end: timestamp("range_end", { withTimezone: true }).notNull(),
    format: text("format", { enum: ["pdf", "json"] }).notNull().default("pdf"),
    status: text("status", { enum: ["pending", "ready", "failed"] })
      .notNull()
      .default("pending"),
    artifact_hash: text("artifact_hash"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgIdx: index("evidence_exports_org_idx").on(t.organisation_id),
    createdIdx: index("evidence_exports_created_idx").on(t.organisation_id, t.created_at),
  }),
);

export type EvidenceExport = typeof evidenceExports.$inferSelect;
export type NewEvidenceExport = typeof evidenceExports.$inferInsert;
