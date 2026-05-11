import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types";
import type { EvidenceExport } from "@trustshyft/shared";

export default function EvidenceExportDetailPage() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["evidence-exports", id],
    enabled: !!id,
    queryFn: () =>
      api
        .get<ApiEnvelope<EvidenceExport[]>>(`/api/v1/evidence-exports`)
        .then((r) => r.data.find((ex) => ex.id === id) ?? null),
  });

  async function download() {
    if (!id) return;
    const blob = await api.rawDownload(`/api/v1/evidence-exports/${id}/download`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evidence-${id}.${data?.format ?? "pdf"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader title="Evidence export" description={id} />
      {!data ? <div className="text-slate-500">Loading…</div> : (
        <div className="space-y-4">
          <dl className="grid grid-cols-[160px_1fr] gap-y-2 max-w-2xl text-sm">
            <dt className="text-slate-500">Format</dt>
            <dd>{data.format}</dd>
            <dt className="text-slate-500">Status</dt>
            <dd>{data.status}</dd>
            <dt className="text-slate-500">Range</dt>
            <dd>{data.range_start} → {data.range_end}</dd>
            <dt className="text-slate-500">Artifact hash</dt>
            <dd className="font-mono text-xs break-all">{data.artifact_hash ?? "—"}</dd>
          </dl>
          <button
            onClick={download}
            className="rounded-md bg-slate-900 text-white text-sm px-3 py-2 hover:bg-slate-700"
          >
            Download
          </button>
        </div>
      )}
    </>
  );
}
