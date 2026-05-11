/**
 * Demo seed placeholder for Phase 1.
 *
 * Real seed will:
 *   1. Install audit.reject_mutation trigger from src/db/sql/append-only-trigger.sql.
 *   2. Insert one demo organisation, one admin user, three decision points.
 *   3. Insert a handful of oversight records (covered + escalated + incomplete).
 *
 * For now this is intentionally inert so the workspace installs cleanly.
 */

import { closeDb } from "../../config/db.js";

async function main(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("[seed] Phase 1 demo seed placeholder - no-op");
  await closeDb();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[seed] failed:", err);
  process.exit(1);
});
