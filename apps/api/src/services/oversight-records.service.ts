import { randomUUID } from "node:crypto";
import type { OversightRecordCreateInput } from "@trustshyft/shared";
import type {
  OversightRecord,
  OversightRecordWithStatus,
  DerivedRecordStatus,
} from "@trustshyft/shared";
import { REQUIRED_OVERSIGHT_FIELDS } from "@trustshyft/shared";
import { HttpError } from "../middleware/error-handler.js";
import { hashOversightRecord } from "./hash.service.js";
import { decisionPointsService } from "./decision-points.service.js";

const store = new Map<string, OversightRecord>();

function deriveStatus(row: OversightRecord): DerivedRecordStatus {
  if (row.escalated) return "Escalated";
  for (const field of REQUIRED_OVERSIGHT_FIELDS) {
    const value = row[field as keyof OversightRecord];
    if (value === null || value === undefined || value === "") {
      return "Incomplete";
    }
  }
  return "Covered";
}

function withStatus(row: OversightRecord): OversightRecordWithStatus {
  return { ...row, status: deriveStatus(row) };
}

export const oversightRecordsService = {
  create(
    organisation_id: string,
    reviewer_user_id: string | null,
    input: OversightRecordCreateInput,
  ): OversightRecordWithStatus {
    // Validate the decision point belongs to the same org and is enabled.
    const dp = decisionPointsService.get(organisation_id, input.decision_point_id);
    if (!dp.enabled) {
      throw new HttpError(409, "decision_point_disabled");
    }

    const recorded_at = new Date().toISOString();
    const base = {
      organisation_id,
      decision_point_id: input.decision_point_id,
      reviewer_user_id: input.reviewer_user_id ?? reviewer_user_id ?? null,
      outcome: input.outcome ?? null,
      escalated: input.escalated,
      notes: input.notes ?? null,
      recorded_at,
    };
    const integrity_hash = hashOversightRecord(base);
    const row: OversightRecord = { id: randomUUID(), ...base, integrity_hash };
    store.set(row.id, row);
    return withStatus(row);
  },

  list(
    organisation_id: string,
    filters: { decision_point_id?: string; range_start?: string; range_end?: string } = {},
  ): OversightRecordWithStatus[] {
    return [...store.values()]
      .filter((row) => row.organisation_id === organisation_id)
      .filter((row) =>
        filters.decision_point_id ? row.decision_point_id === filters.decision_point_id : true,
      )
      .filter((row) => (filters.range_start ? row.recorded_at >= filters.range_start : true))
      .filter((row) => (filters.range_end ? row.recorded_at <= filters.range_end : true))
      .sort((a, b) => (a.recorded_at < b.recorded_at ? 1 : -1))
      .map(withStatus);
  },

  get(organisation_id: string, id: string): OversightRecordWithStatus {
    const row = store.get(id);
    if (!row || row.organisation_id !== organisation_id) {
      throw new HttpError(404, "oversight_record_not_found");
    }
    return withStatus(row);
  },
};
