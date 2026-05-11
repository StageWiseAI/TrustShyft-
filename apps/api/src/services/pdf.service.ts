/**
 * PDF service - Phase 1 placeholder.
 *
 * Real implementation will use a headless renderer (puppeteer or similar) to
 * produce a signed PDF bundle from an oversight record list. For now we emit
 * a minimal text/PDF-ish payload so the download endpoint is exercisable.
 */

import type { OversightRecordWithStatus } from "@trustshyft/shared";

export const pdfService = {
  renderEvidenceBundle(
    organisation_id: string,
    range_start: string,
    range_end: string,
    records: OversightRecordWithStatus[],
  ): Buffer {
    const lines = [
      "TrustShyft Evidence Export (Phase 1 placeholder)",
      "",
      `Organisation: ${organisation_id}`,
      `Range: ${range_start} -> ${range_end}`,
      `Records: ${records.length}`,
      "",
      ...records.map(
        (r) =>
          `- ${r.recorded_at}  dp=${r.decision_point_id}  status=${r.status}  hash=${r.integrity_hash.slice(0, 12)}`,
      ),
    ];
    return Buffer.from(lines.join("\n"), "utf8");
  },
};
