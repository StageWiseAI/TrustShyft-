import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types";
import type { EvidenceExport, EvidenceExportCreateInput } from "@trustshyft/shared";
import { formatDateTime } from "@/lib/utils";

export default function EvidenceExportsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["evidence-exports"],
    queryFn: () =>
      api.get<ApiEnvelope<EvidenceExport[]>>("/api/v1/evidence-exports").then((r) => r.data),
  });

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const [form, setForm] = useState<EvidenceExportCreateInput>({
    range_start: weekAgo.toISOString(),
    range_end: now.toISOString(),
    format: "pdf",
  });

  const create = useMutation({
    mutationFn: (input: EvidenceExportCreateInput) =>
      api.post("/api/v1/evidence-exports", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["evidence-exports"] }),
  });

  return (
    <>
      <PageHeader title="Evidence Exports" description="Hashed evidence bundles." />
      <form
        className="flex flex-wrap items-end gap-3 mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate(form);
        }}
      >
        <label className="block">
          <span className="text-xs text-slate-500">Range start</span>
          <input
            type="datetime-local"
            className="block mt-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
            value={toLocal(form.range_start)}
            onChange={(e) => setForm({ ...form, range_start: fromLocal(e.target.value) })}
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-500">Range end</span>
          <input
            type="datetime-local"
            className="block mt-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
            value={toLocal(form.range_end)}
            onChange={(e) => setForm({ ...form, range_end: fromLocal(e.target.value) })}
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-500">Format</span>
          <select
            className="block mt-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
            value={form.format}
            onChange={(e) =>
              setForm({ ...form, format: e.target.value as EvidenceExportCreateInput["format"] })
            }
          >
            <option value="pdf">pdf</option>
            <option value="json">json</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded-md bg-slate-900 text-white text-sm px-3 py-2 hover:bg-slate-700"
        >
          Generate export
        </button>
      </form>

      <div className="border border-slate-200 rounded-lg bg-white divide-y divide-slate-100">
        {(data ?? []).map((ex) => (
          <div key={ex.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-sm">{formatDateTime(ex.created_at)} · {ex.format}</div>
              <div className="text-xs text-slate-500 font-mono">
                {ex.artifact_hash ? ex.artifact_hash.slice(0, 24) + "…" : "—"}
              </div>
            </div>
            <Link
              to={`/evidence-exports/${ex.id}`}
              className="text-sm text-slate-900 underline underline-offset-4"
            >
              View
            </Link>
          </div>
        ))}
        {(!data || data.length === 0) && (
          <div className="px-4 py-3 text-slate-500 text-sm">No exports yet.</div>
        )}
      </div>
    </>
  );
}

function toLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocal(local: string): string {
  return new Date(local).toISOString();
}
