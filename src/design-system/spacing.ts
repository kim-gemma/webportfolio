// 4px 기준 스페이싱 스케일. 컴포넌트의 padding/gap/margin은 이 토큰만 사용하고
// px 값을 직접 하드코딩하지 않는다.

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
} as const;

export type SpacingToken = keyof typeof spacing;
