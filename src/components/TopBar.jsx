import { PORTFOLIO_DATA } from "../data/portfolioData";
import { useGame } from "../context/GameContext";
import { ZONES, ZONE_META } from "../config/zonesConfig";

const TOP_BAR_LABELS = {
  about: "About",
  technologies: "Skills",
  cv: "CV",
  projects: "Projects",
  contact: "Contact",
};

export default function TopBar({ onZoneSelect }) {
  const { hintZone, activeZone } = useGame();
  const highlighted = activeZone || hintZone;

  return (
    <header className="top-bar">
      <span
        className="top-bar-name"
        onClick={() => onZoneSelect("home")}
        role="button"
        tabIndex="0"
      >
        {PORTFOLIO_DATA.profile.name}
      </span>
      <nav className="top-bar-nav">
        {ZONES.map((zoneKey) => (
          <button
            key={zoneKey}
            className={`top-bar-link${highlighted === zoneKey ? " active" : ""}`}
            style={highlighted === zoneKey ? { "--zone-color": ZONE_META[zoneKey].color } : undefined}
            onClick={() => onZoneSelect(zoneKey)}
          >
            <span className="top-bar-link-icon">{ZONE_META[zoneKey].icon}</span>
            {TOP_BAR_LABELS[zoneKey]}
          </button>
        ))}
      </nav>
    </header>
  );
}
