import type { ReactNode } from "react";
import { radius, spacing, typography } from "../../../design-system";
import { useThemeColors } from "../../../design-system/useThemeColors";

export type BadgeVariant = "default" | "accent" | "success" | "danger";

export interface BadgeProps {
  /** 색상 의미. `accent`는 강조(태그/카테고리), `success`/`danger`는 상태 표시용. */
  variant?: BadgeVariant;
  children: ReactNode;
}

/**
 * 작은 라벨/태그/상태 표시용 디자인 시스템 배지. `OnlineVisitorsBadge`의
 * 상태 점(dot)과 같은 색상 의미를 공유한다.
 */
export function Badge({ variant = "default", children }: BadgeProps) {
  const theme = useThemeColors();

  const variantColor: Record<BadgeVariant, { bg: string; fg: string }> = {
    default: { bg: theme.panelRaised, fg: theme.textDim },
    accent: { bg: theme.accent, fg: theme.bg },
    success: { bg: "#4caf5033", fg: "#4caf50" },
    danger: { bg: "#e25c5c33", fg: "#e25c5c" },
  };
  const { bg, fg } = variantColor[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: `${spacing.xs} ${spacing.sm}`,
        borderRadius: radius.full,
        background: bg,
        color: fg,
        fontFamily: typography.fontBody,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export default Badge;
