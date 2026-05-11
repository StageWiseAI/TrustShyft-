import { pgSchema, uuid, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { organisations } from "../app/organisations.js";
import { decisionPoints } from "../app/decision-points.js";
import { users } from "../app/users.js";

export const auditSchema = pgSchema("audit");

/**
 * Append-only oversight record. UPDATE and DELETE are rejected at the DB layer
 * by the trigger in src/db/sql/append-only-trigger.sql. recorded_at and
 * integrity_hash are always set server-side.
 *
 * Status is NOT stored. It is derived from these fields:
 *   escalated = true              -> Escalated
 *   missing required field        -> Incomplete
 *   otherwise                     -> Covered
 */
export const oversightRecords = auditSchema.table(
  "oversight_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organisation_id: uuid("organisation_id")
      .notNull()
      .references(() => organisations.id, { onDelete: "restrict" }),
    decision_point_id: uuid("decision_point_id")
      .notNull()
      .references(() => decisionPoints.id, { onDelete: "restrict" }),
    reviewer_user_id: uuid("reviewer_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    outcome: text("outcome"),
    escalated: boolean("escalated").notNull().default(false),
    notes: text("notes"),
    recorded_at: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
    integrity_hash: text("integrity_hash").notNull(),
  },
  (t) => ({
    orgRecordedIdx: index("oversight_records_org_recorded_idx").on(
      t.organisation_id,
      t.recorded_at,
    ),
    dpIdx: index("oversight_records_dp_idx").on(t.decision_point_id),
  }),
);

export type OversightRecord = typeof oversightRecords.$inferSelect;
export type NewOversightRecord = typeof oversightRecords.$inferInsert;
