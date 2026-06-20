import { createContext, useContext, useState, useCallback } from "react";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [activeZone, setActiveZone] = useState(null);
  const [hintZone, setHintZone] = useState(null);
  const [gameInstance, setGameInstance] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mailboxNear, setMailboxNear] = useState(false);
  const [mailboxModalOpen, setMailboxModalOpen] = useState(false);
  const [aiNpcNear, setAiNpcNear] = useState(false);

  const openZone = useCallback((zoneKey) => {
    setActiveZone(zoneKey);
  }, []);

  const closeZone = useCallback(() => {
    setActiveZone(null);
  }, []);

  const onZoneEnter = useCallback((zoneKey) => {
    setHintZone(zoneKey);
  }, []);

  const onZoneExit = useCallback(() => {
    setHintZone(null);
  }, []);

  const onSceneReady = useCallback((scene) => {
    setCurrentScene(scene);
  }, []);

  const onMailboxEnter = useCallback(() => {
    setMailboxNear(true);
  }, []);

  const onMailboxExit = useCallback(() => {
    setMailboxNear(false);
  }, []);

  const openMailboxModal = useCallback(() => {
    setMailboxModalOpen(true);
  }, []);

  const closeMailboxModal = useCallback(() => {
    setMailboxModalOpen(false);
  }, []);

  const onAiNpcEnter = useCallback(() => {
    setAiNpcNear(true);
  }, []);

  const onAiNpcExit = useCallback(() => {
    setAiNpcNear(false);
  }, []);

  const value = {
    activeZone,
    hintZone,
    gameInstance,
    currentScene,
    isMobile,
    mailboxNear,
    mailboxModalOpen,
    aiNpcNear,
    openZone,
    closeZone,
    onZoneEnter,
    onZoneExit,
    onSceneReady,
    onMailboxEnter,
    onMailboxExit,
    openMailboxModal,
    closeMailboxModal,
    onAiNpcEnter,
    onAiNpcExit,
    setGameInstance,
    setIsMobile,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
