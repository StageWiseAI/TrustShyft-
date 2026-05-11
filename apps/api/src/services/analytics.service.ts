import type {
  CoverageAnalytics,
  EscalationRateAnalytics,
} from "@trustshyft/shared";
import { decisionPointsService } from "./decision-points.service.js";
import { oversightRecordsService } from "./oversight-records.service.js";

function defaultRange(): { range_start: string; range_end: string } {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 7);
  return { range_start: start.toISOString(), range_end: end.toISOString() };
}

function periodsInRange(period: "day" | "week" | "month", days: number): number {
  switch (period) {
    case "day":
      return days;
    case "week":
      return days / 7;
    case "month":
      return days / 30;
  }
}

export const analyticsService = {
  /**
   * Coverage = completed oversight records / expected checkpoints over the
   * selected range. "Expected" is the sum across enabled decision points of
   * (expected_per_period * periods_in_range).
   */
  coverage(
    organisation_id: string,
    range: { range_start?: string; range_end?: string } = {},
  ): CoverageAnalytics {
    const { range_start, range_end } = {
      ...defaultRange(),
      ...range,
    };
    const startMs = new Date(range_start).getTime();
    const endMs = new Date(range_end).getTime();
    const days = Math.max((endMs - startMs) / (1000 * 60 * 60 * 24), 0);

    const enabled = decisionPointsService.list(organisation_id, { include_disabled: false });
    const expected = enabled.reduce(
      (acc, dp) => acc + dp.expected_per_period * periodsInRange(dp.period, days),
      0,
    );

    const records = oversightRecordsService.list(organisation_id, {
      range_start,
      range_end,
    });
    const completed = records.filter((r) => r.status !== "Incomplete").length;

    const coverage_ratio = expected > 0 ? Math.min(completed / expected, 1) : 0;
    return {
      expected: Math.round(expected),
      completed,
      coverage_ratio,
      period_start: range_start,
      period_end: range_end,
    };
  },

  escalationRate(
    organisation_id: string,
    range: { range_start?: string; range_end?: string } = {},
  ): EscalationRateAnalytics {
    const { range_start, range_end } = { ...defaultRange(), ...range };
    const records = oversightRecordsService.list(organisation_id, {
      range_start,
      range_end,
    });
    const total_records = records.length;
    const escalated_records = records.filter((r) => r.escalated).length;
    const escalation_rate = total_records > 0 ? escalated_records / total_records : 0;
    return {
      total_records,
      escalated_records,
      escalation_rate,
      period_start: range_start,
      period_end: range_end,
    };
  },
};
