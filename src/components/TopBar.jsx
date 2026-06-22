import { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";
import { ZONES, ZONE_META } from "../config/zonesConfig";
import DownloadButton from "./DownloadButton";
import ThemeToggle from "./ThemeToggle";
import { RESUME_FILE, PORTFOLIO_FILE } from "../utils/fileDownload";

const TOP_BAR_LABELS = {
  about: "About",
  technologies: "Skills",
  cv: "CV",
  projects: "Projects",
  contact: "Contact",
};

export default function TopBar({ onHomeSelect, onZoneSelect }) {
  const { hintZone, activeZone } = useGame();
  const highlighted = activeZone || hintZone;
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  // 실제 렌더링된 TopBar 높이를 CSS 변수로 노출해 Online Visitors Badge 등
  // 떠 있는 UI가 TopBar 높이(safe-area, 햄버거 버튼 크기 등에 따라 가변적)에
  // 맞춰 간격을 계산할 수 있게 한다.
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;
    const updateHeight = () => {
      document.documentElement.style.setProperty("--topbar-height", `${headerEl.offsetHeight}px`);
    };
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(headerEl);
    return () => resizeObserver.disconnect();
  }, []);

  // 모바일 메뉴가 열려 있을 때 ESC로 닫을 수 있게 한다
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => {
      if (e.code === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const handleHomeClick = () => {
    setMenuOpen(false);
    onHomeSelect();
  };

  const handleHomeKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleHomeClick();
    }
  };

  const handleZoneClick = (zoneKey) => {
    onZoneSelect(zoneKey);
    setMenuOpen(false);
  };

  const renderZoneButtons = (extraClassName = "") =>
    ZONES.map((zoneKey) => (
      <button
        key={zoneKey}
        className={`top-bar-link${extraClassName ? ` ${extraClassName}` : ""}${highlighted === zoneKey ? " active" : ""}`}
        style={highlighted === zoneKey ? { "--zone-color": ZONE_META[zoneKey].color } : undefined}
        onClick={() => handleZoneClick(zoneKey)}
      >
        <span className="top-bar-link-icon">{ZONE_META[zoneKey].icon}</span>
        {TOP_BAR_LABELS[zoneKey]}
      </button>
    ));

  return (
    <header className="top-bar" ref={headerRef}>
      <span
        className="top-bar-name"
        onClick={handleHomeClick}
        onKeyDown={handleHomeKeyDown}
        role="button"
        tabIndex={0}
        aria-label="홈으로 이동"
        title="홈으로 이동"
      >
        HOME
      </span>

      {/* PC: 가로 메뉴. 768px 이하에서는 CSS로 숨기고 햄버거 메뉴를 대신 보여준다 */}
      <nav className="top-bar-nav top-bar-nav-desktop" aria-label="주요 메뉴">
        {renderZoneButtons()}
      </nav>
      <div
        className="top-bar-downloads top-bar-downloads-desktop"
        role="group"
        aria-label="문서 다운로드"
      >
        <DownloadButton
          file={RESUME_FILE}
          icon="📄"
          label="Resume"
          ariaLabel="이력서 PDF 다운로드 또는 새 탭에서 열기"
        />
        <DownloadButton
          file={PORTFOLIO_FILE}
          icon="📁"
          label="Portfolio"
          ariaLabel="포트폴리오 PDF 다운로드 또는 새 탭에서 열기"
        />
      </div>

      {/* 데스크탑/모바일 모두 항상 노출 — 햄버거 메뉴 안에 숨기지 않는다 */}
      <ThemeToggle />

      {/* 모바일(768px 이하): 햄버거 버튼. CSS로 PC에서는 숨긴다 */}
      <button
        type="button"
        className="hamburger-btn"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu-panel"
        aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="hamburger-icon" aria-hidden="true">
          {menuOpen ? "✕" : "☰"}
        </span>
      </button>

      {menuOpen && (
        <>
          <button
            type="button"
            className="mobile-menu-backdrop"
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
          />
          <div id="mobile-menu-panel" className="mobile-menu-panel" role="menu">
            <nav className="mobile-menu-nav" aria-label="주요 메뉴">
              {renderZoneButtons("mobile-menu-link")}
            </nav>
            <div className="mobile-menu-downloads" role="group" aria-label="문서 다운로드">
              <DownloadButton
                file={RESUME_FILE}
                icon="📄"
                label="Resume"
                ariaLabel="이력서 PDF 다운로드 또는 새 탭에서 열기"
                className="download-btn-large"
                onAfterClick={() => setMenuOpen(false)}
              />
              <DownloadButton
                file={PORTFOLIO_FILE}
                icon="📁"
                label="Portfolio"
                ariaLabel="포트폴리오 PDF 다운로드 또는 새 탭에서 열기"
                className="download-btn-large"
                onAfterClick={() => setMenuOpen(false)}
              />
            </div>
          </div>
        </>
      )}
    </header>
  );
}
