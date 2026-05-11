import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types";
import type { CoverageAnalytics, EscalationRateAnalytics } from "@trustshyft/shared";

export function useCoverage() {
  return useQuery({
    queryKey: ["analytics", "coverage"],
    queryFn: () =>
      api
        .get<ApiEnvelope<CoverageAnalytics>>("/api/v1/analytics/coverage")
        .then((r) => r.data),
  });
}

export function useEscalationRate() {
  return useQuery({
    queryKey: ["analytics", "escalation-rate"],
    queryFn: () =>
      api
        .get<ApiEnvelope<EscalationRateAnalytics>>("/api/v1/analytics/escalation-rate")
        .then((r) => r.data),
  });
}
