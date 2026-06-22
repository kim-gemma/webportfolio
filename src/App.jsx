import { useRef, useEffect, useCallback } from "react";
import { GameProvider, useGame } from "./context/GameContext";
import { usePhaserGame, useKeyboardInput } from "./hooks";

import TopBar from "./components/TopBar";
import ZoneHint from "./components/ZoneHint";
import FooterHint from "./components/FooterHint";
import VirtualJoystick from "./components/VirtualJoystick";
import ZoneModal from "./components/ZoneModal";
import MailboxModal from "./components/MailboxModal";
import MailboxHint from "./components/MailboxHint";
import NpcAiHint from "./components/NpcAiHint";
import FloatingActionArea from "./components/FloatingActionArea";
import { ChatProvider } from "./chat/context/ChatContext";
import ChatModal from "./chat/components/ChatModal";
import { NpcChatProvider, useNpcChat } from "./npcChat/context/NpcChatContext";
import NpcChatModal from "./npcChat/components/NpcChatModal";

function GameContent() {
  const gameContainerRef = useRef(null);
  const {
    activeZone,
    closeZone,
    isMobile,
    setIsMobile,
    currentScene,
    openZone,
    mailboxModalOpen,
    closeMailboxModal,
  } = useGame();
  const { npcChatOpen, closeNpcChat } = useNpcChat();

  // 게임 인스턴스 초기화
  usePhaserGame(gameContainerRef);
  
  // 키보드 입력 처리
  useKeyboardInput();

  // 모바일 감지
  useEffect(() => {
    const handleMediaChange = () => {
      setIsMobile(
        window.matchMedia("(max-width: 768px), (pointer: coarse)").matches
      );
    };

    handleMediaChange();
    const mediaQuery = window.matchMedia(
      "(max-width: 768px), (pointer: coarse)"
    );
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [setIsMobile]);

  // Escape 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code !== "Escape") return;
      if (npcChatOpen) {
        closeNpcChat();
      } else if (mailboxModalOpen) {
        closeMailboxModal();
      } else if (activeZone) {
        closeZone();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeZone, closeZone, mailboxModalOpen, closeMailboxModal, npcChatOpen, closeNpcChat]);

  const handleJoystick = useCallback((x, y) => {
    if (currentScene) {
      currentScene.setJoystickVector(x, y);
    }
  }, [currentScene]);

  // GardenScene이 준비된 시점(PLAY로 두 번째 화면에 진입한 시점)부터 TopBar를 보여준다
  const gameStarted = Boolean(currentScene);

  const handleHomeSelect = useCallback(() => {
    const alreadyHome =
      !activeZone && !mailboxModalOpen && (currentScene?.isAtHome?.() ?? true);
    if (alreadyHome) return;

    closeZone();
    closeMailboxModal();
    currentScene?.movePlayerHome?.();
  }, [activeZone, mailboxModalOpen, currentScene, closeZone, closeMailboxModal]);

  return (
    <div className="app-shell">
      {gameStarted && (
        <TopBar onHomeSelect={handleHomeSelect} onZoneSelect={openZone} />
      )}

      <div className="game-stage" ref={gameContainerRef}>
        {/* 게임 캔버스가 렌더링되는 영역 */}
        {/* ZoneHint는 게임 위에 오버레이됨 (모바일 전용 "입장하기" 버튼) */}
        <ZoneHint isMobile={isMobile} />
        <MailboxHint isMobile={isMobile} />
        <NpcAiHint isMobile={isMobile} />
      </div>

      {isMobile && gameStarted && <VirtualJoystick onMove={handleJoystick} />}

      {/* Online Visitors 배지 + Contact 버튼을 우측 하단에 하나로 묶어 보여준다.
          Contact는 Loading/Intro 연출 중에는 숨기고 GardenScene 입장 후에만 노출한다. */}
      <FloatingActionArea gameStarted={gameStarted} />

      {activeZone && (
        <ZoneModal zoneKey={activeZone} onClose={closeZone} />
      )}

      {mailboxModalOpen && <MailboxModal onClose={closeMailboxModal} />}

      <FooterHint isMobile={isMobile} />
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <NpcChatProvider>
        <GameProvider>
          <GameContent />
        </GameProvider>
        <NpcChatModal />
      </NpcChatProvider>
      <ChatModal />
    </ChatProvider>
  );
}