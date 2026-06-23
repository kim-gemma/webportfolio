// styles.css의 --radius-md / --radius-lg와 동일한 border-radius 토큰.

export const radius = {
  sm: "4px",
  md: "10px",
  lg: "16px",
  full: "999px",
} as const;

export type RadiusToken = keyof typeof radius;
