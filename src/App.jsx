import { useState, useEffect, useRef, useCallback } from "react";
import Phaser from "phaser";
import { createGardenScene } from "./game/gardenScene";
import { IntroScene } from "./game/introScene";

import TopBar from "./components/TopBar";
import ZoneHint from "./components/ZoneHint";
import FooterHint from "./components/FooterHint";
import VirtualJoystick from "./components/VirtualJoystick";
import ZoneModal from "./components/ZoneModal";

export default function App() {
  const gameContainerRef = useRef(null);
  const gameRef = useRef(null);
  const sceneRef = useRef(null);

  const [activeZone, setActiveZone] = useState(null);
  const [hintZone, setHintZone] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(
      window.matchMedia("(max-width: 768px), (pointer: coarse)").matches
    );
  }, []);

  const handleZoneEnter = useCallback((key) => {
    setHintZone(key);
  }, []);

  const handleZoneExit = useCallback(() => {
    setHintZone(null);
  }, []);

  const handleReady = useCallback((scene) => {
    sceneRef.current = scene;
  }, []);

  useEffect(() => {
    if (!gameContainerRef.current || gameRef.current) return;

    const GardenScene = createGardenScene({
      onZoneEnter: handleZoneEnter,
      onZoneExit: handleZoneExit,
      onReady: handleReady,
    });

    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: gameContainerRef.current.clientWidth,
      height: gameContainerRef.current.clientHeight,
      backgroundColor: "#1a1f2e",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scene: [IntroScene, GardenScene],
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    gameRef.current = new Phaser.Game(config);

    const handleResize = () => {
      if (gameRef.current && gameContainerRef.current) {
        gameRef.current.scale.resize(
          gameContainerRef.current.clientWidth,
          gameContainerRef.current.clientHeight
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
  }, [handleZoneEnter, handleZoneExit, handleReady]);

  useEffect(() => {
    const onKey = (e) => {
      if (
        (e.code === "Enter" || e.code === "Space") &&
        hintZone &&
        !activeZone
      ) {
        setActiveZone(hintZone);
      }

      if (e.code === "Escape" && activeZone) {
        setActiveZone(null);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hintZone, activeZone]);

  const handleJoystick = useCallback((x, y) => {
    if (sceneRef.current) {
      sceneRef.current.setJoystickVector(x, y);
    }
  }, []);

  return (
    <div className="app-shell">
      <TopBar onZoneSelect={setActiveZone} />

      <div className="game-stage" ref={gameContainerRef}>
        {hintZone && !activeZone && (
          <ZoneHint zoneKey={hintZone} isMobile={isMobile} />
        )}
      </div>

      {isMobile && <VirtualJoystick onMove={handleJoystick} />}

      {activeZone && (
        <ZoneModal zoneKey={activeZone} onClose={() => setActiveZone(null)} />
      )}

      <FooterHint isMobile={isMobile} />
    </div>
  );
}