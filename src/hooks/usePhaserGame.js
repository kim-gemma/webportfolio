import { useEffect, useRef, useCallback } from "react";
import Phaser from "phaser";
import { createGardenScene } from "../game/gardenScene";
import { IntroScene } from "../game/introScene";
import { useGame } from "../context/GameContext";

export function usePhaserGame(containerRef) {
  const gameRef = useRef(null);
  const { setGameInstance, onZoneEnter, onZoneExit, onSceneReady } = useGame();

  const GardenScene = useCallback(() => {
    return createGardenScene({
      onZoneEnter,
      onZoneExit,
      onReady: onSceneReady,
    });
  }, [onZoneEnter, onZoneExit, onSceneReady]);

  useEffect(() => {
    if (!containerRef?.current || gameRef.current) {
      return;
    }

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
      scene: [IntroScene, GardenScene()],
      pixelArt: true,
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

    return () => {
      window.removeEventListener("resize", handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [setGameInstance, GardenScene]);

  return gameRef;
}
