import { uuid, text, timestamp, integer, boolean, index } from "drizzle-orm/pg-core";
import { appSchema, organisations } from "./organisations.js";

export const decisionPoints = appSchema.table(
  "decision_points",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organisation_id: uuid("organisation_id")
      .notNull()
      .references(() => organisations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    expected_per_period: integer("expected_per_period").notNull().default(1),
    period: text("period", { enum: ["day", "week", "month"] })
      .notNull()
      .default("week"),
    enabled: boolean("enabled").notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgIdx: index("decision_points_org_idx").on(t.organisation_id),
    enabledIdx: index("decision_points_enabled_idx").on(t.organisation_id, t.enabled),
  }),
);

export type DecisionPoint = typeof decisionPoints.$inferSelect;
export type NewDecisionPoint = typeof decisionPoints.$inferInsert;
