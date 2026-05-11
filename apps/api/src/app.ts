import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authMiddleware, requireAuth } from "./middleware/auth.js";
import { organisationScope } from "./middleware/organisation-scope.js";
import { errorHandler } from "./middleware/error-handler.js";
import { healthRouter } from "./routes/health.js";
import { decisionPointsRouter } from "./routes/v1/decision-points.js";
import { oversightRecordsRouter } from "./routes/v1/oversight-records.js";
import { evidenceExportsRouter } from "./routes/v1/evidence-exports.js";
import { analyticsRouter } from "./routes/v1/analytics.js";

export function createApp(): express.Express {
  const app = express();

  app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(authMiddleware);

  app.use("/health", healthRouter);

  const v1 = express.Router();
  v1.use(requireAuth, organisationScope);
  v1.use("/decision-points", decisionPointsRouter);
  v1.use("/oversight-records", oversightRecordsRouter);
  v1.use("/evidence-exports", evidenceExportsRouter);
  v1.use("/analytics", analyticsRouter);
  app.use("/api/v1", v1);

  app.use(errorHandler);
  return app;
}
