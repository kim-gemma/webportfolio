import { PORTFOLIO_DATA } from "../data/portfolioData";

const ZONES = [
  { key: "about", label: "About" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
];

export default function TopBar({ onZoneSelect }) {
  return (
    <header className="top-bar">
      <span className="top-bar-name">{PORTFOLIO_DATA.profile.name}</span>
      <nav className="top-bar-nav">
        {ZONES.map((z) => (
          <button
            key={z.key}
            className="top-bar-link"
            onClick={() => onZoneSelect(z.key)}
          >
            {z.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
