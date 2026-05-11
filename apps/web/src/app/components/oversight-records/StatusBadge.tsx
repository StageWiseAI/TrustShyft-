import type { DerivedRecordStatus } from "@trustshyft/shared";
import { cn } from "@/lib/utils";

const styles: Record<DerivedRecordStatus, string> = {
  Covered: "bg-emerald-100 text-emerald-800",
  Escalated: "bg-amber-100 text-amber-800",
  Incomplete: "bg-slate-200 text-slate-700",
};

export function StatusBadge({ status }: { status: DerivedRecordStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
