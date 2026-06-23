import { useEffect, useState } from "react";
import { resolveInitialTheme, THEME_CHANGE_EVENT, type Theme } from "../theme/theme";
import { colors } from "./colors";

/** 현재 라이트/다크 테마에 맞는 색상 토큰을 반환하고, 테마 전환 시 자동으로 갱신한다. */
export function useThemeColors() {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme());

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      setTheme((e as CustomEvent<Theme>).detail);
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  return colors[theme];
}
