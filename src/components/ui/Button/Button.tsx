import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { radius, spacing, typography } from "../../../design-system";
import { useThemeColors } from "../../../design-system/useThemeColors";
import "../../../design-system/keyframes.css";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** 버튼의 시각적 우선순위. `primary`는 강조색 배경, `secondary`는 테두리만 있는 보조 버튼. */
  variant?: ButtonVariant;
  /** true면 스피너를 보여주고 클릭을 막는다. `disabled`와 별도로 둔 이유는 "처리 중"과
   * "선택 불가"가 의미적으로 다르고, 로딩이 끝나면 다시 눌러야 하기 때문이다. */
  loading?: boolean;
  /** 버튼 안에 표시할 내용 (텍스트/아이콘) */
  children: React.ReactNode;
}

/**
 * 디자인 시스템 기본 버튼. 색상/여백/폰트/모서리 반경은 전부 `src/design-system` 토큰에서
 * 가져오며 색상은 현재 라이트/다크 테마를 자동으로 따른다.
 */
export function Button({
  variant = "primary",
  loading = false,
  disabled = false,
  children,
  style,
  ...rest
}: ButtonProps) {
  const theme = useThemeColors();
  const isDisabled = disabled || loading;

  const variantStyle: CSSProperties =
    variant === "primary"
      ? { background: theme.accent, color: theme.bg, border: "none" }
      : { background: "transparent", color: theme.text, border: `2px solid ${theme.border}` };

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={loading || undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        padding: `${spacing.sm} ${spacing.lg}`,
        borderRadius: radius.md,
        fontFamily: typography.fontDisplay,
        fontSize: typography.fontSize.sm,
        lineHeight: typography.lineHeight.tight,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled && !loading ? 0.5 : 1,
        transition: "transform 0.08s ease, opacity 0.15s ease",
        ...variantStyle,
        ...style,
      }}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          style={{
            width: "12px",
            height: "12px",
            borderRadius: radius.full,
            borderWidth: "2px",
            borderStyle: "solid",
            borderRightColor: variant === "primary" ? theme.bg : theme.text,
            borderBottomColor: variant === "primary" ? theme.bg : theme.text,
            borderLeftColor: variant === "primary" ? theme.bg : theme.text,
            borderTopColor: "transparent",
            animation: "ds-spin 0.6s linear infinite",
            display: "inline-block",
          }}
        />
      )}
      {children}
    </button>
  );
}

export default Button;
