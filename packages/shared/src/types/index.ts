import type { DerivedRecordStatus } from "../constants";

export type UUID = string;
export type ISODateString = string;

export interface Organisation {
  id: UUID;
  name: string;
  slug: string;
  created_at: ISODateString;
}

export interface User {
  id: UUID;
  organisation_id: UUID;
  clerk_user_id: string | null;
  email: string;
  display_name: string | null;
  role: "owner" | "admin" | "reviewer" | "viewer";
  created_at: ISODateString;
}

export interface DecisionPoint {
  id: UUID;
  organisation_id: UUID;
  name: string;
  description: string | null;
  expected_per_period: number;
  period: "day" | "week" | "month";
  enabled: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface OversightRecord {
  id: UUID;
  organisation_id: UUID;
  decision_point_id: UUID;
  reviewer_user_id: UUID | null;
  outcome: string | null;
  escalated: boolean;
  notes: string | null;
  recorded_at: ISODateString;
  integrity_hash: string;
}

export interface OversightRecordWithStatus extends OversightRecord {
  status: DerivedRecordStatus;
}

export interface EvidenceExport {
  id: UUID;
  organisation_id: UUID;
  requested_by_user_id: UUID | null;
  range_start: ISODateString;
  range_end: ISODateString;
  format: "pdf" | "json";
  status: "pending" | "ready" | "failed";
  artifact_hash: string | null;
  created_at: ISODateString;
}

export interface CoverageAnalytics {
  expected: number;
  completed: number;
  coverage_ratio: number;
  period_start: ISODateString;
  period_end: ISODateString;
}

export interface EscalationRateAnalytics {
  total_records: number;
  escalated_records: number;
  escalation_rate: number;
  period_start: ISODateString;
  period_end: ISODateString;
}
