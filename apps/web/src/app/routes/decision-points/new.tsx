import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { api } from "@/lib/api";
import type { DecisionPointCreateInput } from "@trustshyft/shared";

export default function NewDecisionPointPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<DecisionPointCreateInput>({
    name: "",
    description: "",
    expected_per_period: 1,
    period: "week",
  });

  const create = useMutation({
    mutationFn: (input: DecisionPointCreateInput) =>
      api.post("/api/v1/decision-points", input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["decision-points"] });
      navigate("/decision-points");
    },
  });

  return (
    <>
      <PageHeader title="New decision point" />
      <form
        className="space-y-4 max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate(form);
        }}
      >
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </label>
        <div className="flex gap-4">
          <label className="block">
            <span className="text-sm font-medium">Expected per period</span>
            <input
              type="number"
              min={1}
              className="mt-1 w-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={form.expected_per_period}
              onChange={(e) =>
                setForm({ ...form, expected_per_period: Number(e.target.value) })
              }
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Period</span>
            <select
              className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={form.period}
              onChange={(e) =>
                setForm({ ...form, period: e.target.value as DecisionPointCreateInput["period"] })
              }
            >
              <option value="day">day</option>
              <option value="week">week</option>
              <option value="month">month</option>
            </select>
          </label>
        </div>
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-md bg-slate-900 text-white text-sm px-4 py-2 hover:bg-slate-700 disabled:opacity-50"
        >
          {create.isPending ? "Creating…" : "Create"}
        </button>
        {create.error ? (
          <div className="text-sm text-red-600">Error: {(create.error as Error).message}</div>
        ) : null}
      </form>
    </>
  );
}
