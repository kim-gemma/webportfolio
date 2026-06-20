import { env } from "../config/env.js";
import { NPC_SYSTEM_PROMPT } from "../config/npcSystemPrompt.js";

export interface GeminiChatTurn {
  role: "user" | "model";
  text: string;
}

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

/** Gemini API가 비정상 응답(HTTP status 포함)을 반환했을 때 던지는 에러. */
export class GeminiApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "GeminiApiError";
  }
}

/**
 * Gemini generateContent REST API를 호출해 다음 모델 응답 텍스트를 받아온다.
 * 공식 SDK 대신 fetch로 직접 호출해 의존성을 늘리지 않는다 (discordService와 동일한 방식).
 */
export async function generateNpcReply(history: GeminiChatTurn[]): Promise<string> {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: NPC_SYSTEM_PROMPT }] },
      contents: history.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
      })),
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.6,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new GeminiApiError(
      response.status,
      `Gemini API responded with status ${response.status}: ${errorBody}`
    );
  }

  const data = (await response.json()) as GeminiGenerateContentResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini API returned no text in response.");
  }

  return text.trim();
}
