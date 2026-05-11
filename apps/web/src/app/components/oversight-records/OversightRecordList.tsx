import { Link } from "react-router-dom";
import { useOversightRecords } from "@/hooks/use-oversight-records";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

export function OversightRecordList() {
  const { data, isLoading, error } = useOversightRecords();
  if (isLoading) return <div className="text-slate-500">Loading…</div>;
  if (error) return <div className="text-red-600 text-sm">Failed to load oversight records</div>;
  if (!data || data.length === 0)
    return <div className="text-slate-500 text-sm">No oversight records yet.</div>;
  return (
    <div className="border border-slate-200 rounded-lg bg-white divide-y divide-slate-100">
      {data.map((r) => (
        <Link
          to={`/oversight-records/${r.id}`}
          key={r.id}
          className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
        >
          <div>
            <div className="text-sm">{formatDateTime(r.recorded_at)}</div>
            <div className="text-xs text-slate-500 font-mono">
              {r.integrity_hash.slice(0, 16)}…
            </div>
          </div>
          <StatusBadge status={r.status} />
        </Link>
      ))}
    </div>
  );
}
