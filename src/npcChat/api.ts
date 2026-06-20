import type { ChatTurn, NpcChatResponse } from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://webportfolio-cv10.onrender.com";

export async function sendNpcChatMessage(
  message: string,
  history: ChatTurn[]
): Promise<NpcChatResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/npc-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });
    const data: NpcChatResponse = await res.json();

    if (!res.ok || !data.success) {
      return { success: false, error: data.error ?? "Something went wrong. Please try again." };
    }

    return data;
  } catch {
    return { success: false, error: "Could not reach the assistant. Please try again later." };
  }
}
