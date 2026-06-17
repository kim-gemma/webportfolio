import { useMemo } from "react";
import { useGame } from "../context/GameContext";
import { ZONE_META } from "../config/zonesConfig";

export default function ZoneHint({ zoneKey, isMobile }) {
  const { hintZone } = useGame();
  const meta = ZONE_META[zoneKey];

  const isVisible = useMemo(() => hintZone === zoneKey, [hintZone, zoneKey]);

  if (!isVisible) return null;

  return (
    <div className="zone-hint">
      <span className="zone-hint-icon">{meta.icon}</span>
      <span>{meta.title}</span>
      <span className="zone-hint-key">{isMobile ? "탭하여 보기" : "Enter ↵"}</span>
    </div>
  );
}
