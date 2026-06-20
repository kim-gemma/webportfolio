import type { Request, Response } from "express";
import { isValidChatHistory, isValidChatMessage } from "../middleware/validation.js";
import { getNpcReply } from "../services/npcChatService.js";
import { GeminiApiError } from "../services/geminiService.js";

const QUOTA_EXCEEDED_MESSAGE = "AI 사용량이 일시적으로 초과되었습니다. 잠시 후 다시 시도해주세요.";
const GENERIC_FAILURE_MESSAGE = "잠시 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

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

    // Gemini 쿼터 초과(429)는 별도의 친절한 안내 메시지로 응답한다.
    if (err instanceof GeminiApiError && err.status === 429) {
      res.status(429).json({ success: false, error: QUOTA_EXCEEDED_MESSAGE });
      return;
    }

    res.status(502).json({ success: false, error: GENERIC_FAILURE_MESSAGE });
  }
}
