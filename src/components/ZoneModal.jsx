import { useEffect } from "react";
import { useGame } from "../context/GameContext";
import { ZONE_META } from "../config/zonesConfig";
import {
  AboutContent,
  TechnologiesContent,
  CvContent,
  ProjectsContent,
  ContactContent,
} from "./modals";

const MODAL_COMPONENTS = {
  about: AboutContent,
  technologies: TechnologiesContent,
  cv: CvContent,
  projects: ProjectsContent,
  contact: ContactContent,
};

export default function ZoneModal({ zoneKey, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const ContentComponent = MODAL_COMPONENTS[zoneKey];

  if (!ContentComponent) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        style={{ "--zone-color": ZONE_META[zoneKey].color }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
        <ContentComponent />
      </div>
    </div>
  );
}
