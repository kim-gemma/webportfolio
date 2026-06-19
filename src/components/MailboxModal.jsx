import { useEffect } from "react";
import DownloadButton from "./DownloadButton";
import { RESUME_FILE, PORTFOLIO_FILE } from "../utils/fileDownload";

export default function MailboxModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel mailbox-modal"
        style={{ "--zone-color": "#4a78a0" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="닫기">
          ×
        </button>
        <div className="modal-body">
          <div className="modal-eyebrow">📮 Mailbox </div>
          <h2 className="modal-title">이력서 / 포트폴리오 다운로드</h2>
          <p className="modal-paragraph">
            아래 버튼을 눌러 PDF 파일을 새 탭에서 열거나 다운로드할 수 있습니다.
          </p>
          <div className="mailbox-modal-actions">
            <DownloadButton
              file={RESUME_FILE}
              icon="📄"
              label="이력서 다운로드"
              ariaLabel="이력서 PDF 다운로드 또는 새 탭에서 열기"
              className="download-btn-large"
            />
            <DownloadButton
              file={PORTFOLIO_FILE}
              icon="📁"
              label="포트폴리오 다운로드"
              ariaLabel="포트폴리오 PDF 다운로드 또는 새 탭에서 열기"
              className="download-btn-large"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
