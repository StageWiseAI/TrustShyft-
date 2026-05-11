import { Router } from "express";
import { analyticsRangeSchema } from "@trustshyft/shared";
import { analyticsService } from "../../services/analytics.service.js";

export const analyticsRouter = Router();

analyticsRouter.get("/coverage", (req, res) => {
  const range = analyticsRangeSchema.parse(req.query);
  const result = analyticsService.coverage(req.auth!.organisation_id, range);
  res.json({ data: result });
});

analyticsRouter.get("/escalation-rate", (req, res) => {
  const range = analyticsRangeSchema.parse(req.query);
  const result = analyticsService.escalationRate(req.auth!.organisation_id, range);
  res.json({ data: result });
});
