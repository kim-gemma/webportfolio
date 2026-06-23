import { memo, useCallback, useRef, useState } from "react";
import { openDownloadFile } from "../utils/fileDownload";
import { playClickSound } from "../utils/sound";

// TopBar(데스크톱) 안에서 file/icon/label/ariaLabel이 고정된 채로 여러 번 렌더링되므로,
// TopBar가 hintZone/activeZone 변경 등 무관한 이유로 리렌더될 때 함께 리렌더되지 않도록 memo한다.
function DownloadButton({
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

export default memo(DownloadButton);
