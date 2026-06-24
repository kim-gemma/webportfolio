import { Router } from "express";
import { getAdminDashboard } from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

export const adminRouter = Router();

adminRouter.get("/api/admin/dashboard", requireAdmin, getAdminDashboard);
