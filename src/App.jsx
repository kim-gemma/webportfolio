import { useRef, useEffect, useCallback } from "react";
import { GameProvider, useGame } from "./context/GameContext";
import { usePhaserGame, useKeyboardInput } from "./hooks";

import TopBar from "./components/TopBar";
import ZoneHint from "./components/ZoneHint";
import FooterHint from "./components/FooterHint";
import VirtualJoystick from "./components/VirtualJoystick";
import ZoneModal from "./components/ZoneModal";

function GameContent() {
  const gameContainerRef = useRef(null);
  const { activeZone, closeZone, isMobile, setIsMobile, currentScene, openZone } = useGame();

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
      if (e.code === "Escape" && activeZone) {
        closeZone();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeZone, closeZone]);

  const handleJoystick = useCallback((x, y) => {
    if (currentScene) {
      currentScene.setJoystickVector(x, y);
    }
  }, [currentScene]);

  const handleTopBarSelect = useCallback((key) => {
    if (key === "home") {
      closeZone();
      if (currentScene?.movePlayerHome) {
        currentScene.movePlayerHome();
      }
      return;
    }

    openZone(key);
  }, [currentScene, closeZone, openZone]);

  return (
    <div className="app-shell">
      <TopBar onZoneSelect={handleTopBarSelect} />

      <div className="game-stage" ref={gameContainerRef}>
        {/* 게임 캔버스가 렌더링되는 영역 */}
        {/* ZoneHint는 게임 위에 오버레이됨 */}
      </div>

      {isMobile && <VirtualJoystick onMove={handleJoystick} />}

      {activeZone && (
        <ZoneModal zoneKey={activeZone} onClose={closeZone} />
      )}

      <FooterHint isMobile={isMobile} />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}