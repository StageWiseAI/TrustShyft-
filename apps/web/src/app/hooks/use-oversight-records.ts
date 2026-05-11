import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types";
import type { OversightRecordWithStatus } from "@trustshyft/shared";

export function useOversightRecords() {
  return useQuery({
    queryKey: ["oversight-records"],
    queryFn: () =>
      api
        .get<ApiEnvelope<OversightRecordWithStatus[]>>("/api/v1/oversight-records")
        .then((r) => r.data),
  });
}

export function useOversightRecord(id: string | undefined) {
  return useQuery({
    queryKey: ["oversight-records", id],
    enabled: !!id,
    queryFn: () =>
      api
        .get<ApiEnvelope<OversightRecordWithStatus>>(`/api/v1/oversight-records/${id}`)
        .then((r) => r.data),
  });
}
