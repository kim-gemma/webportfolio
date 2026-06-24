import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!env.adminApiToken) {
    res.status(503).json({ success: false, error: "Admin API is not configured." });
    return;
  }

  const token = req.header("x-admin-token");
  if (token !== env.adminApiToken) {
    res.status(401).json({ success: false, error: "Unauthorized." });
    return;
  }

  next();
}
