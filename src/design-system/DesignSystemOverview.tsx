import { colors } from "./colors";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { typography } from "./typography";

/**
 * Storybook "Design System/Overview" 페이지에서만 쓰는 소개용 컴포넌트.
 * `.mdx`가 아니라 일반 컴포넌트로 만든 이유는, Storybook 10 + Vite 빌드 환경에서
 * 커스텀 `.mdx` 파일을 `storybook build`로 정적 빌드할 때 `mdx-react-shim` 모듈을
 * Rollup이 해석하지 못해 빌드가 실패하는 문제가 있었기 때문이다(`npm run storybook`
 * 개발 서버에서는 정상 동작하지만 `npm run build-storybook`이 실패함). 일반
 * 컴포넌트 + `.stories.tsx`는 두 명령 모두에서 동일하게 동작한다.
 */
export function DesignSystemOverview() {
  return (
    <div style={{ fontFamily: typography.fontBody, maxWidth: "720px", lineHeight: typography.lineHeight.normal }}>
      <h1 style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize.xl }}>
        Design System
      </h1>
      <p>
        이 디자인 시스템은 "코드 정원" 포트폴리오의 실제 UI(<code>src/styles.css</code>)에서
        쓰는 색상/폰트/반경 값을 TypeScript 토큰으로 옮겨, <code>src/components/ui</code>의
        공통 컴포넌트(Button/Input/Modal/Card/Badge)가 하드코딩 없이 일관된 값을 쓰도록 한다.
      </p>

      <h2 style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize.lg }}>
        왜 만들었나
      </h2>
      <ul>
        <li>
          게임 화면(Phaser 캔버스)과 DOM UI가 섞인 프로젝트라 색상/여백 값이 여러 CSS 파일에
          흩어지기 쉽다. 토큰을 한 곳(<code>src/design-system</code>)에 모아두면 새 컴포넌트를
          만들 때 값을 베껴 쓰지 않고 import해서 쓸 수 있다.
        </li>
        <li>
          Storybook으로 컴포넌트를 게임 로직과 분리된 환경에서 독립적으로 렌더링하고,
          상태별(Primary/Disabled/Loading 등) 시각 결과를 빠르게 확인할 수 있다.
        </li>
      </ul>

      <h2 style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize.lg }}>
        토큰 종류
      </h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #3a4160", padding: spacing.xs }}>파일</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #3a4160", padding: spacing.xs }}>내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: spacing.xs }}>
              <code>colors.ts</code>
            </td>
            <td style={{ padding: spacing.xs }}>
              라이트/다크 테마별 배경·텍스트·강조색. <code>useThemeColors()</code> 훅으로 현재
              테마 값을 구독한다
            </td>
          </tr>
          <tr>
            <td style={{ padding: spacing.xs }}>
              <code>spacing.ts</code>
            </td>
            <td style={{ padding: spacing.xs }}>4px 기준 여백 스케일 (xs~2xl)</td>
          </tr>
          <tr>
            <td style={{ padding: spacing.xs }}>
              <code>typography.ts</code>
            </td>
            <td style={{ padding: spacing.xs }}>폰트 패밀리(픽셀 폰트/모노스페이스), 크기, 굵기, 줄높이</td>
          </tr>
          <tr>
            <td style={{ padding: spacing.xs }}>
              <code>radius.ts</code>
            </td>
            <td style={{ padding: spacing.xs }}>모서리 반경 (sm/md/lg/full)</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize.lg }}>
        색상 토큰 미리보기 (dark)
      </h2>
      <div style={{ display: "flex", gap: spacing.md, flexWrap: "wrap" }}>
        {Object.entries(colors.dark).map(([name, value]) => (
          <div key={name} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: radius.md,
                background: value,
                border: "1px solid #3a4160",
              }}
            />
            <div style={{ fontSize: 12, marginTop: 4 }}>{name}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: typography.fontDisplay, fontSize: typography.fontSize.lg }}>
        컴포넌트 구조
      </h2>
      <pre style={{ background: "#1a1f2e", color: "#f0ebe1", padding: spacing.md, borderRadius: radius.md, overflowX: "auto" }}>
{`src/
├─ design-system/        # colors / spacing / typography / radius 토큰
└─ components/
   └─ ui/
      ├─ Button/
      ├─ Input/
      ├─ Modal/
      ├─ Card/
      └─ Badge/`}
      </pre>
      <p>
        각 컴포넌트 폴더는 <code>ComponentName.tsx</code> + <code>ComponentName.stories.tsx</code> +{" "}
        <code>index.ts</code>로 구성된다. 이 컴포넌트들은 실제 게임 UI(TopBar, ChatWidgetButton
        등)를 대체하지 않는 <strong>독립적인 디자인 시스템 데모</strong>이며, Storybook이 유일한
        사용 환경이다.
      </p>
    </div>
  );
}

export default DesignSystemOverview;
