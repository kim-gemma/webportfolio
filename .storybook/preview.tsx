import { useEffect } from "react";
import type { Decorator, Preview } from "@storybook/react-vite";
import { applyTheme } from "../src/theme/theme";
import "../src/styles.css";

// 실제 서비스(src/theme/theme.ts)와 동일한 라이트/다크 테마 전환 로직을 그대로 재사용한다.
// 디자인 시스템 컴포넌트는 useThemeColors()로 이 data-theme 속성을 구독하므로,
// Storybook 툴바에서 테마를 바꾸면 모든 스토리가 함께 반응한다.
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === "light" ? "light" : "dark";
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <Story />;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "디자인 시스템 라이트/다크 테마",
      defaultValue: "dark",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "dark", title: "🌙 Dark" },
          { value: "light", title: "☀️ Light" },
        ],
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
