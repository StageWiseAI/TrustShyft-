import { pgSchema, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const appSchema = pgSchema("app");

export const organisations = appSchema.table("organisations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Organisation = typeof organisations.$inferSelect;
export type NewOrganisation = typeof organisations.$inferInsert;
