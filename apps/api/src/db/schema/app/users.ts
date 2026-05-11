import { uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { appSchema, organisations } from "./organisations.js";

export const users = appSchema.table(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organisation_id: uuid("organisation_id")
      .notNull()
      .references(() => organisations.id, { onDelete: "cascade" }),
    clerk_user_id: text("clerk_user_id"),
    email: text("email").notNull(),
    display_name: text("display_name"),
    role: text("role", { enum: ["owner", "admin", "reviewer", "viewer"] })
      .notNull()
      .default("viewer"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgIdx: index("users_org_idx").on(t.organisation_id),
    clerkIdx: index("users_clerk_idx").on(t.clerk_user_id),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
