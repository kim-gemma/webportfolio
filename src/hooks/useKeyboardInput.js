import { useEffect } from "react";
import { useGame } from "../context/GameContext";
import { useNpcChat } from "../npcChat/context/NpcChatContext";

export function useKeyboardInput() {
  const {
    hintZone,
    activeZone,
    openZone,
    mailboxNear,
    mailboxModalOpen,
    openMailboxModal,
    aiNpcNear,
  } = useGame();
  const { npcChatOpen, openNpcChat } = useNpcChat();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code !== "Enter" && e.code !== "Space") return;
      if (activeZone || mailboxModalOpen || npcChatOpen) return;

      if (hintZone) {
        openZone(hintZone);
      } else if (mailboxNear) {
        openMailboxModal();
      } else if (aiNpcNear) {
        openNpcChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    hintZone,
    activeZone,
    openZone,
    mailboxNear,
    mailboxModalOpen,
    openMailboxModal,
    aiNpcNear,
    npcChatOpen,
    openNpcChat,
  ]);
}
