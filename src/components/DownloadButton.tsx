import { memo, useCallback, useRef, useState } from "react";
import { openDownloadFile } from "../utils/fileDownload";
import { playClickSound } from "../utils/sound";

export interface DownloadButtonFile {
  path: string;
  label: string;
}

export interface DownloadButtonProps {
  /** 다운로드할 파일 (경로 + 표시용 라벨) */
  file: DownloadButtonFile;
  /** 버튼 좌측에 표시할 아이콘(이모지) */
  icon: string;
  /** 버튼에 표시할 텍스트 */
  label: string;
  /** 스크린리더용 설명 */
  ariaLabel: string;
  /** 추가 클래스명 (모바일 메뉴 안에서는 더 큰 스타일을 적용하기 위해 사용) */
  className?: string;
  /** 클릭 후 추가로 실행할 동작 (예: 모바일 메뉴 닫기). 데스크톱 TopBar에서는 생략된다. */
  onAfterClick?: () => void;
}

// TopBar(데스크톱) 안에서 file/icon/label/ariaLabel이 고정된 채로 여러 번 렌더링되므로,
// TopBar가 hintZone/activeZone 변경 등 무관한 이유로 리렌더될 때 함께 리렌더되지 않도록 memo한다.
function DownloadButton({
  file,
  icon,
  label,
  ariaLabel,
  className = "",
  onAfterClick,
}: DownloadButtonProps) {
  const [pressed, setPressed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    playClickSound();
    setPressed(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
