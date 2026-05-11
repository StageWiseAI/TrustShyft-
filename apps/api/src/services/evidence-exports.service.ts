import { randomUUID } from "node:crypto";
import type {
  EvidenceExport,
  EvidenceExportCreateInput,
} from "@trustshyft/shared";
import { HttpError } from "../middleware/error-handler.js";
import { hashJsonBundle } from "./hash.service.js";
import { oversightRecordsService } from "./oversight-records.service.js";
import { pdfService } from "./pdf.service.js";

interface StoredExport extends EvidenceExport {
  artifact_buffer: Buffer | null;
  artifact_mime: string | null;
}

const store = new Map<string, StoredExport>();

export const evidenceExportsService = {
  create(
    organisation_id: string,
    requested_by_user_id: string | null,
    input: EvidenceExportCreateInput,
  ): EvidenceExport {
    const records = oversightRecordsService.list(organisation_id, {
      range_start: input.range_start,
      range_end: input.range_end,
    });

    let artifact_buffer: Buffer;
    let artifact_mime: string;
    if (input.format === "pdf") {
      artifact_buffer = pdfService.renderEvidenceBundle(
        organisation_id,
        input.range_start,
        input.range_end,
        records,
      );
      artifact_mime = "application/pdf";
    } else {
      artifact_buffer = Buffer.from(JSON.stringify(records, null, 2), "utf8");
      artifact_mime = "application/json";
    }

    const artifact_hash = hashJsonBundle({
      organisation_id,
      range_start: input.range_start,
      range_end: input.range_end,
      format: input.format,
      record_hashes: records.map((r) => r.integrity_hash),
    });

    const row: StoredExport = {
      id: randomUUID(),
      organisation_id,
      requested_by_user_id,
      range_start: input.range_start,
      range_end: input.range_end,
      format: input.format,
      status: "ready",
      artifact_hash,
      created_at: new Date().toISOString(),
      artifact_buffer,
      artifact_mime,
    };
    store.set(row.id, row);
    return toPublic(row);
  },

  list(organisation_id: string): EvidenceExport[] {
    return [...store.values()]
      .filter((row) => row.organisation_id === organisation_id)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .map(toPublic);
  },

  download(
    organisation_id: string,
    id: string,
  ): { buffer: Buffer; mime: string; export: EvidenceExport } {
    const row = store.get(id);
    if (!row || row.organisation_id !== organisation_id) {
      throw new HttpError(404, "evidence_export_not_found");
    }
    if (row.status !== "ready" || !row.artifact_buffer || !row.artifact_mime) {
      throw new HttpError(409, "evidence_export_not_ready");
    }
    return {
      buffer: row.artifact_buffer,
      mime: row.artifact_mime,
      export: toPublic(row),
    };
  },
};

function toPublic(row: StoredExport): EvidenceExport {
  const { artifact_buffer: _b, artifact_mime: _m, ...rest } = row;
  void _b;
  void _m;
  return rest;
}
