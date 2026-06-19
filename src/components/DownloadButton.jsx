import { useCallback, useRef, useState } from "react";
import { openDownloadFile } from "../utils/fileDownload";
import { playClickSound } from "../utils/sound";

export default function DownloadButton({
  file,
  icon,
  label,
  ariaLabel,
  className = "",
  onAfterClick,
}) {
  const [pressed, setPressed] = useState(false);
  const timeoutRef = useRef(null);

  const handleClick = useCallback(() => {
    playClickSound();
    setPressed(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPressed(false), 180);
    openDownloadFile(file.path);
    onAfterClick?.();
  }, [file, onAfterClick]);

  return (
    <button
      type="button"
      className={`download-btn${pressed ? " is-pressed" : ""}${className ? ` ${className}` : ""}`}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      <span className="download-btn-icon" aria-hidden="true">{icon}</span>
      <span className="download-btn-label">{label}</span>
      <span className="download-btn-pdf" aria-hidden="true">⬇</span>
    </button>
  );
}
