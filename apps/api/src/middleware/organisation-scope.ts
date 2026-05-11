import type { NextFunction, Request, Response } from "express";

/**
 * Ensures every authenticated request carries an organisation_id and exposes it
 * to downstream handlers via req.auth. All service layer reads/writes must use
 * req.auth.organisation_id as their tenancy boundary.
 */
export function organisationScope(req: Request, res: Response, next: NextFunction): void {
  if (!req.auth?.organisation_id) {
    res.status(403).json({ error: "no_organisation_scope" });
    return;
  }
  next();
}
