import { createHash } from "node:crypto";

/**
 * Stable SHA-256 hash of an oversight record's content. Used as the
 * integrity_hash that ships with every audit row and every export bundle.
 *
 * The order of fields here is part of the integrity contract and must not
 * be changed without a migration plan.
 */
export function hashOversightRecord(input: {
  organisation_id: string;
  decision_point_id: string;
  reviewer_user_id: string | null;
  outcome: string | null;
  escalated: boolean;
  notes: string | null;
  recorded_at: string;
}): string {
  const canonical = [
    input.organisation_id,
    input.decision_point_id,
    input.reviewer_user_id ?? "",
    input.outcome ?? "",
    String(input.escalated),
    input.notes ?? "",
    input.recorded_at,
  ].join("|");
  return createHash("sha256").update(canonical).digest("hex");
}

export function hashJsonBundle(payload: unknown): string {
  const serialised = JSON.stringify(payload);
  return createHash("sha256").update(serialised).digest("hex");
}
