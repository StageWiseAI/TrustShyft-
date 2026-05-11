import { Router } from "express";
import {
  decisionPointCreateSchema,
  decisionPointUpdateSchema,
} from "@trustshyft/shared";
import { decisionPointsService } from "../../services/decision-points.service.js";
import { requireRole } from "../../middleware/require-role.js";

export const decisionPointsRouter = Router();

decisionPointsRouter.get("/", (req, res) => {
  const include_disabled = req.query.include_disabled === "true";
  const rows = decisionPointsService.list(req.auth!.organisation_id, { include_disabled });
  res.json({ data: rows });
});

decisionPointsRouter.get("/:id", (req, res) => {
  const row = decisionPointsService.get(req.auth!.organisation_id, req.params.id);
  res.json({ data: row });
});

decisionPointsRouter.post("/", requireRole("owner", "admin"), (req, res) => {
  const input = decisionPointCreateSchema.parse(req.body);
  const row = decisionPointsService.create(req.auth!.organisation_id, input);
  res.status(201).json({ data: row });
});

decisionPointsRouter.patch("/:id", requireRole("owner", "admin"), (req, res) => {
  const input = decisionPointUpdateSchema.parse(req.body);
  const row = decisionPointsService.update(req.auth!.organisation_id, req.params.id, input);
  res.json({ data: row });
});

// Soft-disable only. Decision points are never hard-deleted in Phase 1.
decisionPointsRouter.delete("/:id", requireRole("owner", "admin"), (req, res) => {
  const row = decisionPointsService.softDisable(req.auth!.organisation_id, req.params.id);
  res.json({ data: row, soft_disabled: true });
});
