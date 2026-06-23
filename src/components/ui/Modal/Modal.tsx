import { useEffect } from "react";
import type { ReactNode } from "react";
import { radius, spacing, typography } from "../../../design-system";
import { useThemeColors } from "../../../design-system/useThemeColors";

export interface ModalProps {
  /** false면 아무것도 렌더링하지 않는다. */
  isOpen: boolean;
  /** 배경(오버레이) 클릭, 닫기 버튼 클릭, Esc 키 입력 시 호출된다. */
  onClose: () => void;
  /** 모달 상단에 표시할 제목 */
  title?: string;
  children: ReactNode;
}

/**
 * 디자인 시스템 기본 모달. `isOpen`이 false면 DOM에 아무것도 그리지 않으므로
 * 항상 마운트해 두고 `isOpen`만 토글해서 써도 안전하다.
 */
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const theme = useThemeColors();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.panel,
          color: theme.text,
          border: `2px solid ${theme.border}`,
          borderRadius: radius.lg,
          padding: spacing.xl,
          minWidth: "280px",
          maxWidth: "min(90vw, 480px)",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: spacing.lg,
          }}
        >
          {title && (
            <h2
              style={{
                margin: 0,
                fontFamily: typography.fontDisplay,
                fontSize: typography.fontSize.lg,
              }}
            >
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            style={{
              background: "transparent",
              border: "none",
              color: theme.textDim,
              fontSize: typography.fontSize.lg,
              lineHeight: 1,
              padding: spacing.xs,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ fontFamily: typography.fontBody, fontSize: typography.fontSize.md }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
