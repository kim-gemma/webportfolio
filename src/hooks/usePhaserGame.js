import { useEffect, useRef, useCallback } from "react";
import { useGame } from "../context/GameContext";

// Phaser + 씬 코드는 번들에서 가장 무거운 부분(~1.7MB)이라 정적 import 대신
// 동적 import로 분리해 별도 청크로 만든다. 첫 페인트(TopBar 등)는 이 청크를
// 기다리지 않고 그려지고, Phaser는 그 뒤에 비동기로 로드/부팅된다 (Lighthouse
// TBT/FCP 개선 목적 — 게임 자체는 여전히 마운트 즉시 로드를 시작한다).

export function usePhaserGame(containerRef) {
  const gameRef = useRef(null);
  const {
    setGameInstance,
    onZoneEnter,
    onZoneExit,
    onSceneReady,
    onMailboxEnter,
    onMailboxExit,
    onAiNpcEnter,
    onAiNpcExit,
  } = useGame();

  const buildGardenScene = useCallback(
    (createGardenScene) =>
      createGardenScene({
        onZoneEnter,
        onZoneExit,
        onReady: onSceneReady,
        onMailboxEnter,
        onMailboxExit,
        onAiNpcEnter,
        onAiNpcExit,
      }),
    [
      onZoneEnter,
      onZoneExit,
      onSceneReady,
      onMailboxEnter,
      onMailboxExit,
      onAiNpcEnter,
      onAiNpcExit,
    ]
  );

  useEffect(() => {
    if (!containerRef?.current || gameRef.current) {
      return;
    }

    let cancelled = false;
    let cleanupResize = () => {};

    Promise.all([
      import("phaser"),
      import("../game/gardenScene"),
      import("../game/introScene"),
    ]).then(([{ default: Phaser }, { createGardenScene }, { IntroScene }]) => {
      // 이 effect가 cleanup된 뒤(언마운트 등)에 import가 늦게 끝나는 경우를 막는다
      if (cancelled || !containerRef?.current) return;

      const isMobile = window.matchMedia(
        "(max-width: 768px), (pointer: coarse)"
      ).matches;

      const config = {
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        backgroundColor: "#1a1f2e",
        physics: {
          default: "arcade",
          arcade: {
            debug: false,
          },
        },
        scene: [IntroScene, buildGardenScene(createGardenScene)],
        pixelArt: true,
        // 모바일 GPU 부담을 줄이기 위해 프레임을 30fps로 캡 (데스크탑은 60fps 유지)
        fps: isMobile ? { target: 30, min: 24 } : undefined,
        render: {
          antialias: false,
          roundPixels: true,
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      gameRef.current = new Phaser.Game(config);
      setGameInstance(gameRef.current);

      const handleResize = () => {
        if (gameRef.current?.isBooted && containerRef?.current) {
          gameRef.current.scale.resize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          );
        }
      };

      window.addEventListener("resize", handleResize);
      cleanupResize = () => window.removeEventListener("resize", handleResize);
    });

    return () => {
      cancelled = true;
      cleanupResize();
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [setGameInstance, buildGardenScene]);

  return gameRef;
}
