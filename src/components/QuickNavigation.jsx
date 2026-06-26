import { ZONE_META } from "../config/zonesConfig";

const QUICK_ITEMS = [
  { label: "Pixel Garden 소개", zoneKey: "projects" },
  { label: "Architecture", zoneKey: "architecture" },
];

export default function QuickNavigation({ onSelect }) {
  return (
    <aside className="quick-nav" aria-label="프로젝트 빠른 이동">
      <div className="quick-nav-title">Projects</div>
      <div className="quick-nav-list">
        {QUICK_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className="quick-nav-item"
            onClick={() => onSelect(item.zoneKey)}
          >
            <span
              className="quick-nav-dot"
              style={{ "--quick-color": ZONE_META[item.zoneKey].color }}
              aria-hidden="true"
            />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
