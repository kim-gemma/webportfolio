import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

/**
 * `Button`은 디자인 시스템의 기본 액션 컴포넌트다. 색상/여백/타이포그래피는 모두
 * `src/design-system` 토큰을 사용하며, 라이트/다크 테마를 자동으로 따라간다.
 *
 * 실제 게임 화면(`ChatWidgetButton`, PLAY 버튼 등)과는 별도로 운영되는
 * 독립적인 디자인 시스템 컴포넌트로, Storybook에서 상태별 동작을 확인할 수 있다.
 */
const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["primary", "secondary"],
      description: "버튼의 시각적 우선순위",
    },
    loading: {
      control: "boolean",
      description: "true면 스피너를 보여주고 클릭을 막는다",
    },
    disabled: {
      control: "boolean",
      description: "버튼 클릭을 막는다",
    },
  },
  args: {
    children: "Button",
    onClick: () => {},
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "Disabled Button",
  },
};

export const Loading: Story = {
  args: {
    variant: "primary",
    loading: true,
    children: "Loading...",
  },
};
