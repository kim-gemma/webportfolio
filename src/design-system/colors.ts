// "코드 정원" 포트폴리오의 실제 다크/라이트 테마 색상(src/styles.css의 CSS 변수)을
// TypeScript 토큰으로도 노출한다. styles.css가 단일 진실 공급원(SSOT)이며,
// 이 파일은 그 값을 component 코드(JS 객체/인라인 스타일)에서 쓰기 위한 미러다.
// 값을 바꿀 때는 반드시 styles.css의 :root / [data-theme] 블록도 함께 수정한다.

export const colors = {
  dark: {
    bg: "#1a1f2e",
    panel: "#252b3d",
    panelRaised: "#2e3550",
    accent: "#f4a259",
    accentSoft: "#f4a25933",
    teal: "#7ec8c9",
    text: "#f0ebe1",
    textDim: "#b7b2a5",
    border: "#3a4160",
  },
  light: {
    bg: "#f6f1e6",
    panel: "#fffdf8",
    panelRaised: "#ece4d3",
    accent: "#f4a259",
    accentSoft: "#f4a25933",
    teal: "#4fa8a9",
    text: "#1a1f2e",
    textDim: "#5b5f72",
    border: "#cfc9bd",
  },
  // 다크/라이트 모두 동일한 시맨틱 색 (상태 표시용)
  semantic: {
    danger: "#e25c5c",
    success: "#4caf50",
  },
} as const;

export type ThemeName = keyof typeof colors;
export type ColorToken = keyof typeof colors.dark;
