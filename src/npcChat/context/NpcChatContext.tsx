import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { sendNpcChatMessage } from "../api";
import { NPC_GREETING } from "../constants";
import type { ChatTurn } from "../types";

interface DisplayMessage {
  role: "user" | "model";
  text: string;
}

interface NpcChatContextValue {
  npcChatOpen: boolean;
  openNpcChat: () => void;
  closeNpcChat: () => void;
  messages: DisplayMessage[];
  loading: boolean;
  errorMessage: string;
  sendMessage: (text: string) => Promise<void>;
}

const NpcChatContext = createContext<NpcChatContextValue | null>(null);

export function NpcChatProvider({ children }: { children: ReactNode }) {
  const [npcChatOpen, setNpcChatOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: "model", text: NPC_GREETING },
  ]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openNpcChat = useCallback(() => setNpcChatOpen(true), []);
  const closeNpcChat = useCallback(() => setNpcChatOpen(false), []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setErrorMessage("");
      // 첫 인사말은 Gemini에 보낼 대화 기록에는 포함하지 않는다 (UI 표시용일 뿐)
      const history: ChatTurn[] = messages
        .filter((_, index) => index > 0)
        .map((m) => ({ role: m.role, text: m.text }));

      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      setLoading(true);

      const result = await sendNpcChatMessage(trimmed, history);

      setLoading(false);

      if (!result.success || !result.reply) {
        setErrorMessage(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setMessages((prev) => [...prev, { role: "model", text: result.reply as string }]);
    },
    [messages, loading]
  );

  const value: NpcChatContextValue = {
    npcChatOpen,
    openNpcChat,
    closeNpcChat,
    messages,
    loading,
    errorMessage,
    sendMessage,
  };

  return <NpcChatContext.Provider value={value}>{children}</NpcChatContext.Provider>;
}

export function useNpcChat(): NpcChatContextValue {
  const context = useContext(NpcChatContext);
  if (!context) {
    throw new Error("useNpcChat must be used within NpcChatProvider");
  }
  return context;
}
