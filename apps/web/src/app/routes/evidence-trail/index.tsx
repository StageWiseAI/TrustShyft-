import { PageHeader } from "@/components/layout/PageHeader";
import { EvidenceTrailTable } from "@/components/evidence/EvidenceTrailTable";

export default function EvidenceTrailPage() {
  return (
    <>
      <PageHeader
        title="Evidence Trail"
        description="Read-only chronological trail of every oversight record."
      />
      <EvidenceTrailTable />
    </>
  );
}
