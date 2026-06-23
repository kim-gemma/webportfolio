import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { radius, spacing, typography } from "../../../design-system";
import { useThemeColors } from "../../../design-system/useThemeColors";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** 입력값이 유효하지 않을 때 빨간 테두리와 도움말 메시지를 보여준다. */
  error?: string;
}

/**
 * 디자인 시스템 기본 텍스트 입력 필드. `error`를 전달하면 테두리가 강조색에서
 * danger 색으로 바뀌고 입력창 아래에 에러 메시지가 표시된다.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, disabled, style, id, ...rest },
  ref
) {
  const theme = useThemeColors();
  const borderColor = error ? "#e25c5c" : theme.border;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing.xs }}>
      <input
        ref={ref}
        id={id}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error && id ? `${id}-error` : undefined}
        style={{
          padding: `${spacing.sm} ${spacing.md}`,
          borderRadius: radius.md,
          border: `2px solid ${borderColor}`,
          background: theme.panel,
          color: theme.text,
          fontFamily: typography.fontBody,
          fontSize: typography.fontSize.md,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "text",
          outline: "none",
          minWidth: "220px",
          ...style,
        }}
        {...rest}
      />
      {error && (
        <span
          id={id ? `${id}-error` : undefined}
          role="alert"
          style={{
            color: "#e25c5c",
            fontFamily: typography.fontBody,
            fontSize: typography.fontSize.xs,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
});

export default Input;
