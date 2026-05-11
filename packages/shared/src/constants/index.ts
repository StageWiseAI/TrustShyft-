export const API_VERSION = "v1" as const;
export const API_PREFIX = `/api/${API_VERSION}` as const;

export const PHASE_1_NAV = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Decision Points", path: "/decision-points" },
  { label: "Oversight Records", path: "/oversight-records" },
  { label: "Evidence Trail", path: "/evidence-trail" },
  { label: "Evidence Exports", path: "/evidence-exports" },
] as const;

export const DERIVED_RECORD_STATUS = {
  Covered: "Covered",
  Escalated: "Escalated",
  Incomplete: "Incomplete",
} as const;

export type DerivedRecordStatus =
  (typeof DERIVED_RECORD_STATUS)[keyof typeof DERIVED_RECORD_STATUS];

export const REQUIRED_OVERSIGHT_FIELDS = [
  "decision_point_id",
  "reviewer_user_id",
  "outcome",
] as const;
