import { Router } from "express";
import { evidenceExportCreateSchema } from "@trustshyft/shared";
import { evidenceExportsService } from "../../services/evidence-exports.service.js";

export const evidenceExportsRouter = Router();

evidenceExportsRouter.post("/", (req, res) => {
  const input = evidenceExportCreateSchema.parse(req.body);
  const row = evidenceExportsService.create(
    req.auth!.organisation_id,
    req.auth!.user_id,
    input,
  );
  res.status(201).json({ data: row });
});

evidenceExportsRouter.get("/", (req, res) => {
  const rows = evidenceExportsService.list(req.auth!.organisation_id);
  res.json({ data: rows });
});

evidenceExportsRouter.get("/:id/download", (req, res) => {
  const { buffer, mime, export: meta } = evidenceExportsService.download(
    req.auth!.organisation_id,
    req.params.id,
  );
  res.setHeader("content-type", mime);
  res.setHeader(
    "content-disposition",
    `attachment; filename="evidence-${meta.id}.${meta.format}"`,
  );
  res.setHeader("x-artifact-hash", meta.artifact_hash ?? "");
  res.status(200).send(buffer);
});
