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

      // TopBar 버튼(다크모드 토글 등)은 클릭 후에도 포커스를 유지하는 경우가 있는데,
      // 그 상태에서 Enter/Space를 누르면 브라우저가 그 버튼의 click을 다시 합성해
      // 모달이 열려 있어도 의도치 않게 다시 실행돼버린다. 게임 화면에서는 Enter를
      // NPC 등 게임 상호작용 전용으로 예약해야 하므로, TopBar에 남은 포커스는
      // 모달이 열려 있는지와 무관하게 항상 정리한다. 모달 내부 입력창/링크는
      // ".top-bar" 바깥이라 영향받지 않는다.
      const focused = document.activeElement;
      if (focused?.closest?.(".top-bar")) {
        e.preventDefault();
        focused.blur();
      }

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
