import { useGame } from "../context/GameContext";
import { useNpcChat } from "../npcChat/context/NpcChatContext";

export default function NpcAiHint({ isMobile }) {
  const { aiNpcNear, activeZone, mailboxModalOpen } = useGame();
  const { npcChatOpen, openNpcChat } = useNpcChat();

  if (!aiNpcNear || activeZone || mailboxModalOpen || npcChatOpen) return null;

  return (
    <button
      type="button"
      className="zone-hint ai-npc-hint"
      onClick={openNpcChat}
      aria-label="AI Portfolio Assistant와 대화하기"
    >
      <span className="zone-hint-icon">🤖</span>
      <span>AI Assistant</span>
      <span className="zone-hint-key">{isMobile ? "탭하여 열기" : "Enter ↵"}</span>
    </button>
  );
}
