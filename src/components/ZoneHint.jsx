const ZONE_META = {
  about: { title: "About Me", icon: "🏠" },
  skills: { title: "Skills", icon: "📚" },
  experience: { title: "Experience", icon: "📜" },
  projects: { title: "Projects", icon: "🖼" },
  contact: { title: "Contact", icon: "📮" },
};

export default function ZoneHint({ zoneKey, isMobile }) {
  const meta = ZONE_META[zoneKey];
  return (
    <div className="zone-hint">
      <span className="zone-hint-icon">{meta.icon}</span>
      <span>{meta.title}</span>
      <span className="zone-hint-key">{isMobile ? "탭하여 보기" : "Enter ↵"}</span>
    </div>
  );
}
