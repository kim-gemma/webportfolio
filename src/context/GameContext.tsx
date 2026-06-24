import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { ZoneKey } from "../config/zonesConfig";

// Phaser 게임 인스턴스/씬은 동적 import로 로드되는 별도 청크(src/game/*.js, 타입 없음)에서
// 만들어지므로, 여기서는 구체적인 클래스 타입 대신 형태가 느슨한 타입으로 받아둔다.
export type GameInstance = { destroy: (removeCanvas?: boolean) => void } | null;
export type GardenSceneLike = {
  isAtHome?: () => boolean;
  movePlayerHome?: () => void;
  setJoystickVector?: (x: number, y: number) => void;
} | null;

export interface GameContextValue {
  activeZone: ZoneKey | null;
  hintZone: ZoneKey | null;
  gameInstance: GameInstance;
  currentScene: GardenSceneLike;
  isMobile: boolean;
  mailboxNear: boolean;
  mailboxModalOpen: boolean;
  aiNpcNear: boolean;
  openZone: (zoneKey: ZoneKey) => void;
  closeZone: () => void;
  onZoneEnter: (zoneKey: ZoneKey) => void;
  onZoneExit: () => void;
  onSceneReady: (scene: GardenSceneLike) => void;
  onMailboxEnter: () => void;
  onMailboxExit: () => void;
  openMailboxModal: () => void;
  closeMailboxModal: () => void;
  onAiNpcEnter: () => void;
  onAiNpcExit: () => void;
  setGameInstance: (instance: GameInstance) => void;
  setIsMobile: (isMobile: boolean) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [activeZone, setActiveZone] = useState<ZoneKey | null>(null);
  const [hintZone, setHintZone] = useState<ZoneKey | null>(null);
  const [gameInstance, setGameInstance] = useState<GameInstance>(null);
  const [currentScene, setCurrentScene] = useState<GardenSceneLike>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mailboxNear, setMailboxNear] = useState(false);
  const [mailboxModalOpen, setMailboxModalOpen] = useState(false);
  const [aiNpcNear, setAiNpcNear] = useState(false);

  const openZone = useCallback((zoneKey: ZoneKey) => {
    setActiveZone(zoneKey);
  }, []);

  const closeZone = useCallback(() => {
    setActiveZone(null);
  }, []);

  const onZoneEnter = useCallback((zoneKey: ZoneKey) => {
    setHintZone(zoneKey);
  }, []);

  const onZoneExit = useCallback(() => {
    setHintZone(null);
  }, []);

  const onSceneReady = useCallback((scene: GardenSceneLike) => {
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

  // 매 프레임 갱신되는 hintZone/mailboxNear/aiNpcNear 때문에 value가 자주 바뀌므로,
  // 실제로 바뀐 값에 대해서만 새 객체를 만들어 불필요한 전체 트리 리렌더를 줄인다.
  const value = useMemo<GameContextValue>(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
