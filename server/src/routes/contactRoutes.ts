import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createContactMessage } from "../controllers/contactController.js";

export const contactRouter = Router();

// 짧은 시간에 반복 제출되는 스팸성 요청을 막기 위한 레이트 리밋 (분당 5회)
const contactRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

contactRouter.post("/api/contact", contactRateLimit, createContactMessage);
