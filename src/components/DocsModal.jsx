import { useEffect } from "react";
import DownloadButton from "./DownloadButton";
import { DOCS } from "../config/docsConfig";

/**
 * 상단 메뉴의 "Docs" 버튼을 눌렀을 때 열리는 문서 보관함 모달.
 * Resume / Portfolio / Career Description 등 다운로드 가능한 문서를 카드로 나열한다.
 * 문서 목록은 docsConfig의 DOCS 배열을 map으로 렌더링하므로, 새 문서는 배열에만 추가하면 된다.
 */
export default function DocsModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="닫기">
          ×
        </button>
        <div className="modal-body">
          <div className="modal-eyebrow">📄 Docs</div>
          <h2 className="modal-title">문서보관함</h2>
          <div className="docs-grid">
            {DOCS.map((doc) => (
              <div key={doc.id} className="docs-card">
                <span className="docs-card-icon" aria-hidden="true">
                  {doc.icon}
                </span>
                <h3 className="docs-card-title">{doc.title}</h3>
                <p className="docs-card-desc">{doc.description}</p>
                <DownloadButton
                  file={doc.file}
                  icon={doc.icon}
                  label={doc.buttonLabel}
                  ariaLabel={doc.ariaLabel}
                  className="download-btn-large"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
