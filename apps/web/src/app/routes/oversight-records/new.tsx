import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { api } from "@/lib/api";
import { useDecisionPoints } from "@/hooks/use-decision-points";
import type { OversightRecordCreateInput } from "@trustshyft/shared";

export default function NewOversightRecordPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: decisionPoints } = useDecisionPoints();
  const [form, setForm] = useState<OversightRecordCreateInput>({
    decision_point_id: "",
    outcome: "",
    escalated: false,
    notes: "",
  });

  const create = useMutation({
    mutationFn: (input: OversightRecordCreateInput) =>
      api.post("/api/v1/oversight-records", input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["oversight-records"] });
      await qc.invalidateQueries({ queryKey: ["analytics"] });
      navigate("/oversight-records");
    },
  });

  return (
    <>
      <PageHeader title="Record oversight" />
      <form
        className="space-y-4 max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate(form);
        }}
      >
        <label className="block">
          <span className="text-sm font-medium">Decision point</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.decision_point_id}
            onChange={(e) => setForm({ ...form, decision_point_id: e.target.value })}
            required
          >
            <option value="" disabled>
              Select…
            </option>
            {decisionPoints?.map((dp) => (
              <option key={dp.id} value={dp.id}>
                {dp.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Outcome</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.outcome ?? ""}
            onChange={(e) => setForm({ ...form, outcome: e.target.value })}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.escalated}
            onChange={(e) => setForm({ ...form, escalated: e.target.checked })}
          />
          Escalated
        </label>
        <label className="block">
          <span className="text-sm font-medium">Notes</span>
          <textarea
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.notes ?? ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
          />
        </label>
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-md bg-slate-900 text-white text-sm px-4 py-2 hover:bg-slate-700 disabled:opacity-50"
        >
          {create.isPending ? "Recording…" : "Record"}
        </button>
        {create.error ? (
          <div className="text-sm text-red-600">Error: {(create.error as Error).message}</div>
        ) : null}
      </form>
    </>
  );
}
