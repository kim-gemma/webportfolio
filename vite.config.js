import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    // 빌드할 때마다 dist/stats.html에 번들 구성 트리맵을 생성해 청크 크기를 분석한다
    visualizer({
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 5173,
  },
});
