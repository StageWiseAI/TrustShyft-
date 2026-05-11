import type { NextFunction, Request, Response } from "express";

export interface AuthContext {
  user_id: string;
  organisation_id: string;
  role: "owner" | "admin" | "reviewer" | "viewer";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

/**
 * Phase 1 Clerk auth placeholder.
 *
 * In production this will validate a Clerk session token from the Authorization
 * header (or cookie) using @clerk/express, then load the matching app.users row
 * to resolve organisation_id and role.
 *
 * For the scaffold we accept dev headers so the API is exercisable without Clerk
 * being wired up. Real Clerk integration replaces the body of this function.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const devUser = req.header("x-dev-user-id");
  const devOrg = req.header("x-dev-organisation-id");
  const devRole = (req.header("x-dev-role") ?? "admin") as AuthContext["role"];

  if (devUser && devOrg) {
    req.auth = {
      user_id: devUser,
      organisation_id: devOrg,
      role: devRole,
    };
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.auth) {
    res.status(401).json({ error: "unauthorised" });
    return;
  }
  next();
}
