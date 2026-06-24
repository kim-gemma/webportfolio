import { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";
import { ZONE_META } from "../config/zonesConfig";
import {
  AboutContent,
  TechnologiesContent,
  CvContent,
  ProjectsContent,
  ArchitectureContent,
  ContactContent,
} from "./modals";

const MODAL_COMPONENTS = {
  about: AboutContent,
  technologies: TechnologiesContent,
  cv: CvContent,
  projects: ProjectsContent,
  architecture: ArchitectureContent,
  contact: ContactContent,
};

export default function ZoneModal({ zoneKey, onClose }) {
  const panelRef = useRef(null);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleScroll = () => {
      setShowTopButton(panel.scrollTop > 240);
    };

    handleScroll();
    panel.addEventListener("scroll", handleScroll, { passive: true });
    return () => panel.removeEventListener("scroll", handleScroll);
  }, [zoneKey]);

  const handleScrollTop = () => {
    panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ContentComponent = MODAL_COMPONENTS[zoneKey];

  if (!ContentComponent) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        ref={panelRef}
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
        {showTopButton && (
          <button
            type="button"
            className="modal-top-button"
            onClick={handleScrollTop}
            aria-label="모달 맨 위로 이동"
          >
            TOP
          </button>
        )}
      </div>
    </div>
  );
}
