import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { OversightRecordList } from "@/components/oversight-records/OversightRecordList";

export default function OversightRecordsPage() {
  return (
    <>
      <PageHeader
        title="Oversight Records"
        description="Append-only records of human oversight against decision points."
        actions={
          <Link
            to="/oversight-records/new"
            className="rounded-md bg-slate-900 text-white text-sm px-3 py-2 hover:bg-slate-700"
          >
            Record oversight
          </Link>
        }
      />
      <OversightRecordList />
    </>
  );
}
