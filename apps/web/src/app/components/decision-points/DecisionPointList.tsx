import { Link } from "react-router-dom";
import { useDecisionPoints } from "@/hooks/use-decision-points";

export function DecisionPointList() {
  const { data, isLoading, error } = useDecisionPoints();
  if (isLoading) return <div className="text-slate-500">Loading…</div>;
  if (error) return <div className="text-red-600 text-sm">Failed to load decision points</div>;
  if (!data || data.length === 0)
    return (
      <div className="text-slate-500 text-sm">
        No decision points yet. Create one to begin tracking oversight.
      </div>
    );
  return (
    <div className="border border-slate-200 rounded-lg bg-white divide-y divide-slate-100">
      {data.map((dp) => (
        <Link
          to={`/decision-points/${dp.id}`}
          key={dp.id}
          className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
        >
          <div>
            <div className="font-medium">{dp.name}</div>
            {dp.description ? (
              <div className="text-xs text-slate-500 mt-0.5">{dp.description}</div>
            ) : null}
          </div>
          <div className="text-xs text-slate-500">
            {dp.expected_per_period}/{dp.period} · {dp.enabled ? "enabled" : "disabled"}
          </div>
        </Link>
      ))}
    </div>
  );
}
