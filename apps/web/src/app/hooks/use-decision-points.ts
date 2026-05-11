import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types";
import type { DecisionPoint } from "@trustshyft/shared";

export function useDecisionPoints() {
  return useQuery({
    queryKey: ["decision-points"],
    queryFn: () =>
      api.get<ApiEnvelope<DecisionPoint[]>>("/api/v1/decision-points").then((r) => r.data),
  });
}

export function useDecisionPoint(id: string | undefined) {
  return useQuery({
    queryKey: ["decision-points", id],
    enabled: !!id,
    queryFn: () =>
      api
        .get<ApiEnvelope<DecisionPoint>>(`/api/v1/decision-points/${id}`)
        .then((r) => r.data),
  });
}
