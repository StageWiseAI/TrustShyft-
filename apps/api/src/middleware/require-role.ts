import type { NextFunction, Request, Response } from "express";
import type { AuthContext } from "./auth.js";

export function requireRole(...allowed: AuthContext["role"][]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.auth?.role;
    if (!role || !allowed.includes(role)) {
      res.status(403).json({ error: "forbidden", required_roles: allowed });
      return;
    }
    next();
  };
}
