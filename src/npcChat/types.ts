export type ChatRole = "user" | "model";

export interface ChatTurn {
  role: ChatRole;
  text: string;
}

export interface NpcChatRequest {
  message: string;
  history: ChatTurn[];
}

export interface NpcChatResponse {
  success: boolean;
  reply?: string;
  error?: string;
}
