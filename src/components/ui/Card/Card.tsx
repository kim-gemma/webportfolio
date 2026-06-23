import type { ReactNode } from "react";
import { radius, spacing, typography } from "../../../design-system";
import { useThemeColors } from "../../../design-system/useThemeColors";

export interface CardProps {
  /** 카드 상단에 표시할 제목 */
  title?: string;
  /** 카드 본문 */
  children: ReactNode;
  /** 본문 아래에 표시할 보조 영역 (버튼, 태그 등) */
  footer?: ReactNode;
}

/**
 * 디자인 시스템 기본 카드 컨테이너. Projects/Skills 같은 목록 항목을 감싸는 용도로 쓴다.
 */
export function Card({ title, children, footer }: CardProps) {
  const theme = useThemeColors();

  return (
    <div
      style={{
        background: theme.panel,
        border: `1px solid ${theme.border}`,
        borderRadius: radius.md,
        padding: spacing.lg,
        display: "flex",
        flexDirection: "column",
        gap: spacing.sm,
        color: theme.text,
        fontFamily: typography.fontBody,
        maxWidth: "320px",
      }}
    >
      {title && (
        <h3
          style={{
            margin: 0,
            fontFamily: typography.fontDisplay,
            fontSize: typography.fontSize.md,
          }}
        >
          {title}
        </h3>
      )}
      <div style={{ fontSize: typography.fontSize.md, lineHeight: typography.lineHeight.normal }}>
        {children}
      </div>
      {footer && (
        <div
          style={{
            marginTop: spacing.sm,
            paddingTop: spacing.sm,
            borderTop: `1px solid ${theme.border}`,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
