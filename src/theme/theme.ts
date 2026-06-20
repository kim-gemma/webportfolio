export type Theme = "light" | "dark";

// index.html의 anti-flash 인라인 스크립트에도 동일한 문자열이 하드코딩되어 있다.
// (모듈 시스템 밖에서 실행되는 스크립트라 이 상수를 import할 수 없음 — 값을 바꾸면 함께 수정할 것)
export const THEME_STORAGE_KEY = "portfolio_theme";
export const THEME_CHANGE_EVENT = "themechange";

export function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

export function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

// 문서 타이틀에 붙는 컨셉 라벨. "☀️ Pixel Garden" / "🌙 Pixel Garden Night"
const BASE_TITLE = "김현능 - 프론트엔드 개발자 포트폴리오";
const TITLE_PREFIX: Record<Theme, string> = {
  light: "☀️ Pixel Garden",
  dark: "🌙 Pixel Garden Night",
};

/** data-theme 속성을 갱신하고, Phaser 씬 등 React 트리 밖의 구독자에게 변경을 알린다. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  document.title = `${TITLE_PREFIX[theme]} | ${BASE_TITLE}`;
  window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }));
}
