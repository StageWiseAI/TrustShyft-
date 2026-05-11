import { useCoverage } from "@/hooks/use-analytics";
import { formatPercent } from "@/lib/utils";

export function CoverageCard() {
  const { data, isLoading, error } = useCoverage();
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="text-sm text-slate-500">Coverage</div>
      {isLoading ? (
        <div className="text-slate-400 mt-2">Loading…</div>
      ) : error ? (
        <div className="text-red-600 mt-2 text-sm">Unable to load coverage</div>
      ) : data ? (
        <>
          <div className="text-3xl font-semibold mt-1">
            {formatPercent(data.coverage_ratio)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {data.completed} of {data.expected} expected checkpoints
          </div>
        </>
      ) : null}
    </div>
  );
}
