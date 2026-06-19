import { useEffect } from "react";
import { useGame } from "../context/GameContext";

export function useKeyboardInput() {
  const {
    hintZone,
    activeZone,
    openZone,
    mailboxNear,
    mailboxModalOpen,
    openMailboxModal,
  } = useGame();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code !== "Enter" && e.code !== "Space") return;
      if (activeZone || mailboxModalOpen) return;

      if (hintZone) {
        openZone(hintZone);
      } else if (mailboxNear) {
        openMailboxModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hintZone, activeZone, openZone, mailboxNear, mailboxModalOpen, openMailboxModal]);
}
