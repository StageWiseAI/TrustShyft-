import { z } from "zod";

export const decisionPointCreateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  expected_per_period: z.number().int().positive().default(1),
  period: z.enum(["day", "week", "month"]).default("week"),
});
export type DecisionPointCreateInput = z.infer<typeof decisionPointCreateSchema>;

export const decisionPointUpdateSchema = decisionPointCreateSchema.partial().extend({
  enabled: z.boolean().optional(),
});
export type DecisionPointUpdateInput = z.infer<typeof decisionPointUpdateSchema>;

export const oversightRecordCreateSchema = z.object({
  decision_point_id: z.string().uuid(),
  reviewer_user_id: z.string().uuid().optional().nullable(),
  outcome: z.string().max(500).optional().nullable(),
  escalated: z.boolean().default(false),
  notes: z.string().max(4000).optional().nullable(),
});
export type OversightRecordCreateInput = z.infer<typeof oversightRecordCreateSchema>;

export const evidenceExportCreateSchema = z.object({
  range_start: z.string().datetime(),
  range_end: z.string().datetime(),
  format: z.enum(["pdf", "json"]).default("pdf"),
});
export type EvidenceExportCreateInput = z.infer<typeof evidenceExportCreateSchema>;

export const analyticsRangeSchema = z.object({
  range_start: z.string().datetime().optional(),
  range_end: z.string().datetime().optional(),
});
export type AnalyticsRangeInput = z.infer<typeof analyticsRangeSchema>;
