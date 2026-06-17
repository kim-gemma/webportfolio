import { useEffect } from "react";
import { useGame } from "../context/GameContext";

export function useKeyboardInput() {
  const { hintZone, activeZone, openZone } = useGame();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.code === "Enter" || e.code === "Space") &&
        hintZone &&
        !activeZone
      ) {
        openZone(hintZone);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hintZone, activeZone, openZone]);
}
