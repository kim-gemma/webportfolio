import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createNpcChatReply } from "../controllers/npcChatController.js";

export const npcChatRouter = Router();

// Gemini API 호출은 비용/지연이 있으므로 Contact Form보다 더 엄격하게 제한한다 (분당 15회)
const npcChatRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
});

npcChatRouter.post("/api/npc-chat", npcChatRateLimit, createNpcChatReply);
