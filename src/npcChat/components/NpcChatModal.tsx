import { useEffect } from "react";
import { useNpcChat } from "../context/NpcChatContext";
import NpcChatMessageList from "./NpcChatMessageList";
import NpcChatInput from "./NpcChatInput";
import SuggestedQuestions from "./SuggestedQuestions";

export default function NpcChatModal() {
  const { npcChatOpen, closeNpcChat, errorMessage } = useNpcChat();

  useEffect(() => {
    if (!npcChatOpen) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.code === "Escape") closeNpcChat();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [npcChatOpen, closeNpcChat]);

  if (!npcChatOpen) return null;

  return (
    <div className="modal-overlay npc-chat-modal-overlay" onClick={closeNpcChat}>
      <div className="modal-panel npc-chat-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeNpcChat} aria-label="닫기">
          ×
        </button>
        <div className="npc-chat-modal-header">
          <span className="npc-chat-modal-title">AI Portfolio Assistant</span>
        </div>

        <NpcChatMessageList />

        {errorMessage && <p className="npc-chat-error">{errorMessage}</p>}

        <SuggestedQuestions />
        <NpcChatInput />
      </div>
    </div>
  );
}
