import { randomUUID } from "node:crypto";
import type {
  DecisionPointCreateInput,
  DecisionPointUpdateInput,
} from "@trustshyft/shared";
import type { DecisionPoint } from "@trustshyft/shared";
import { HttpError } from "../middleware/error-handler.js";

/**
 * Phase 1 placeholder store. The Drizzle schema in src/db/schema/app is the
 * persistence source of truth; this in-memory map lets the API run end-to-end
 * before the database is provisioned.
 */
const store = new Map<string, DecisionPoint>();

function byOrg(organisation_id: string): DecisionPoint[] {
  return [...store.values()].filter((dp) => dp.organisation_id === organisation_id);
}

export const decisionPointsService = {
  list(organisation_id: string, { include_disabled = false }: { include_disabled?: boolean } = {}) {
    const all = byOrg(organisation_id);
    return include_disabled ? all : all.filter((dp) => dp.enabled);
  },

  get(organisation_id: string, id: string): DecisionPoint {
    const row = store.get(id);
    if (!row || row.organisation_id !== organisation_id) {
      throw new HttpError(404, "decision_point_not_found");
    }
    return row;
  },

  create(organisation_id: string, input: DecisionPointCreateInput): DecisionPoint {
    const now = new Date().toISOString();
    const row: DecisionPoint = {
      id: randomUUID(),
      organisation_id,
      name: input.name,
      description: input.description ?? null,
      expected_per_period: input.expected_per_period,
      period: input.period,
      enabled: true,
      created_at: now,
      updated_at: now,
    };
    store.set(row.id, row);
    return row;
  },

  update(
    organisation_id: string,
    id: string,
    patch: DecisionPointUpdateInput,
  ): DecisionPoint {
    const existing = this.get(organisation_id, id);
    const updated: DecisionPoint = {
      ...existing,
      ...patch,
      description: patch.description === undefined ? existing.description : (patch.description ?? null),
      updated_at: new Date().toISOString(),
    };
    store.set(id, updated);
    return updated;
  },

  softDisable(organisation_id: string, id: string): DecisionPoint {
    return this.update(organisation_id, id, { enabled: false });
  },
};
