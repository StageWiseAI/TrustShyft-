import { useOversightRecords } from "@/hooks/use-oversight-records";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "../oversight-records/StatusBadge";

export function EvidenceTrailTable() {
  const { data, isLoading, error } = useOversightRecords();
  if (isLoading) return <div className="text-slate-500">Loading evidence trail…</div>;
  if (error) return <div className="text-red-600 text-sm">Failed to load evidence trail</div>;
  if (!data || data.length === 0)
    return <div className="text-slate-500 text-sm">Evidence trail is empty.</div>;
  return (
    <div className="overflow-hidden border border-slate-200 rounded-lg bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-2">Recorded</th>
            <th className="text-left px-4 py-2">Decision point</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Integrity hash</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-2">{formatDateTime(r.recorded_at)}</td>
              <td className="px-4 py-2 font-mono text-xs">{r.decision_point_id}</td>
              <td className="px-4 py-2"><StatusBadge status={r.status} /></td>
              <td className="px-4 py-2 font-mono text-xs">{r.integrity_hash.slice(0, 24)}…</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
