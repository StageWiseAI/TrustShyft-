import { Router } from "express";
import { oversightRecordCreateSchema } from "@trustshyft/shared";
import { oversightRecordsService } from "../../services/oversight-records.service.js";

export const oversightRecordsRouter = Router();

oversightRecordsRouter.post("/", (req, res) => {
  const input = oversightRecordCreateSchema.parse(req.body);
  const row = oversightRecordsService.create(
    req.auth!.organisation_id,
    req.auth!.user_id,
    input,
  );
  res.status(201).json({ data: row });
});

oversightRecordsRouter.get("/", (req, res) => {
  const rows = oversightRecordsService.list(req.auth!.organisation_id, {
    decision_point_id: typeof req.query.decision_point_id === "string"
      ? req.query.decision_point_id
      : undefined,
    range_start: typeof req.query.range_start === "string" ? req.query.range_start : undefined,
    range_end: typeof req.query.range_end === "string" ? req.query.range_end : undefined,
  });
  res.json({ data: rows });
});

oversightRecordsRouter.get("/:id", (req, res) => {
  const row = oversightRecordsService.get(req.auth!.organisation_id, req.params.id);
  res.json({ data: row });
});
