import { useEscalationRate } from "@/hooks/use-analytics";
import { formatPercent } from "@/lib/utils";

export function EscalationRateCard() {
  const { data, isLoading, error } = useEscalationRate();
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="text-sm text-slate-500">Escalation rate</div>
      {isLoading ? (
        <div className="text-slate-400 mt-2">Loading…</div>
      ) : error ? (
        <div className="text-red-600 mt-2 text-sm">Unable to load escalation rate</div>
      ) : data ? (
        <>
          <div className="text-3xl font-semibold mt-1">
            {formatPercent(data.escalation_rate)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {data.escalated_records} escalated of {data.total_records} records
          </div>
        </>
      ) : null}
    </div>
  );
}
