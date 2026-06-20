import { generateNpcReply, type GeminiChatTurn } from "./geminiService.js";

export interface NpcChatRequest {
  history: GeminiChatTurn[];
  message: string;
}

/** 기존 대화 기록 + 새 사용자 메시지를 합쳐 Gemini에 전달하고 답변을 받아온다. */
export async function getNpcReply({ history, message }: NpcChatRequest): Promise<string> {
  const turns: GeminiChatTurn[] = [...history, { role: "user", text: message }];
  return generateNpcReply(turns);
}
