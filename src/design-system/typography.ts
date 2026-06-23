// styles.css의 --font-display / --font-body 폰트 스택과 동일한 타이포그래피 토큰.

export const typography = {
  fontDisplay: '"Press Start 2P", "DungGeunMo", monospace',
  fontBody: '"JetBrains Mono", "Pretendard", "Noto Sans KR", monospace, sans-serif',
  fontSize: {
    xs: "11px",
    sm: "12px",
    md: "14px",
    lg: "16px",
    xl: "20px",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
  },
} as const;
