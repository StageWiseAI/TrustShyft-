import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { useDecisionPoint } from "@/hooks/use-decision-points";

export default function DecisionPointDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useDecisionPoint(id);

  return (
    <>
      <PageHeader title="Decision point" description={id} />
      {isLoading ? <div>Loading…</div> : null}
      {error ? <div className="text-red-600 text-sm">Not found.</div> : null}
      {data ? (
        <dl className="grid grid-cols-[160px_1fr] gap-y-2 max-w-2xl text-sm">
          <dt className="text-slate-500">Name</dt>
          <dd>{data.name}</dd>
          <dt className="text-slate-500">Description</dt>
          <dd>{data.description ?? "—"}</dd>
          <dt className="text-slate-500">Expected</dt>
          <dd>
            {data.expected_per_period} per {data.period}
          </dd>
          <dt className="text-slate-500">Enabled</dt>
          <dd>{data.enabled ? "Yes" : "No (soft-disabled)"}</dd>
          <dt className="text-slate-500">Created</dt>
          <dd>{data.created_at}</dd>
        </dl>
      ) : null}
    </>
  );
}
