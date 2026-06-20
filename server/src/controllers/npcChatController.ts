import type { Request, Response } from "express";
import { isValidChatHistory, isValidChatMessage } from "../middleware/validation.js";
import { getNpcReply } from "../services/npcChatService.js";

/** POST /api/npc-chat 요청을 처리한다. */
export async function createNpcChatReply(req: Request, res: Response): Promise<void> {
  const { message, history } = req.body ?? {};

  if (!isValidChatMessage(message)) {
    res.status(400).json({ success: false, error: "Message is required." });
    return;
  }

  if (history !== undefined && !isValidChatHistory(history)) {
    res.status(400).json({ success: false, error: "History is invalid." });
    return;
  }

  try {
    const reply = await getNpcReply({ history: history ?? [], message: message.trim() });
    res.json({ success: true, reply });
  } catch (err) {
    console.error("[npcChatController] Gemini 응답 생성 실패:", err);
    res.status(502).json({ success: false, error: "Failed to get a reply from the assistant." });
  }
}
