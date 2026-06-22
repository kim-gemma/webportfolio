import type { MouseEvent } from "react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // 클릭 후에도 버튼이 포커스를 유지하면, 게임 화면에서 Enter를 누를 때 이 버튼의
  // click이 다시 합성되어 의도치 않게 테마가 또 바뀐다. 마우스/터치 클릭에는
  // 포커스가 필요 없으므로 즉시 비워서 그 다음 Enter는 게임이 받도록 한다.
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    toggleTheme();
    e.currentTarget.blur();
  };

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={handleClick}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={isDark ? "Light Mode로 전환" : "Dark Mode로 전환"}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? "🌜" : "🌞"}
      </span>
      <span className="theme-toggle-label">{isDark ? "Dark Mode" : "Light Mode"}</span>
    </button>
  );
}
