import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { useOversightRecord } from "@/hooks/use-oversight-records";
import { StatusBadge } from "@/components/oversight-records/StatusBadge";

export default function OversightRecordDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useOversightRecord(id);

  return (
    <>
      <PageHeader title="Oversight record" description={id} />
      {isLoading ? <div>Loading…</div> : null}
      {error ? <div className="text-red-600 text-sm">Not found.</div> : null}
      {data ? (
        <dl className="grid grid-cols-[160px_1fr] gap-y-2 max-w-2xl text-sm">
          <dt className="text-slate-500">Status</dt>
          <dd><StatusBadge status={data.status} /></dd>
          <dt className="text-slate-500">Decision point</dt>
          <dd className="font-mono text-xs">{data.decision_point_id}</dd>
          <dt className="text-slate-500">Reviewer</dt>
          <dd className="font-mono text-xs">{data.reviewer_user_id ?? "—"}</dd>
          <dt className="text-slate-500">Outcome</dt>
          <dd>{data.outcome ?? "—"}</dd>
          <dt className="text-slate-500">Escalated</dt>
          <dd>{data.escalated ? "Yes" : "No"}</dd>
          <dt className="text-slate-500">Notes</dt>
          <dd className="whitespace-pre-wrap">{data.notes ?? "—"}</dd>
          <dt className="text-slate-500">Recorded</dt>
          <dd>{data.recorded_at}</dd>
          <dt className="text-slate-500">Integrity hash</dt>
          <dd className="font-mono text-xs break-all">{data.integrity_hash}</dd>
        </dl>
      ) : null}
    </>
  );
}
