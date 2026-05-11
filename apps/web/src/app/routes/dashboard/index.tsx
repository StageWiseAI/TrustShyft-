import { PageHeader } from "@/components/layout/PageHeader";
import { CoverageCard } from "@/components/analytics/CoverageCard";
import { EscalationRateCard } from "@/components/analytics/EscalationRateCard";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Phase 1 governance loop: track oversight coverage and escalation rate."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <CoverageCard />
        <EscalationRateCard />
      </div>
    </>
  );
}
