import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { DecisionPointList } from "@/components/decision-points/DecisionPointList";

export default function DecisionPointsPage() {
  return (
    <>
      <PageHeader
        title="Decision Points"
        description="Moments where human oversight is expected on AI-assisted work."
        actions={
          <Link
            to="/decision-points/new"
            className="rounded-md bg-slate-900 text-white text-sm px-3 py-2 hover:bg-slate-700"
          >
            New decision point
          </Link>
        }
      />
      <DecisionPointList />
    </>
  );
}
