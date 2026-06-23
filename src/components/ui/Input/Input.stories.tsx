import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

/**
 * `Input`은 디자인 시스템 기본 텍스트 입력 필드다. `error` prop을 전달하면 유효성
 * 검사 실패 상태(빨간 테두리 + 메시지)를 보여준다.
 */
const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    error: {
      control: "text",
      description: "에러 메시지. 전달되면 입력창이 invalid 상태로 표시된다",
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "Kim Hyunneung",
  },
};

export const Placeholder: Story = {
  args: {
    placeholder: "이메일을 입력하세요",
  },
};

export const Error: Story = {
  args: {
    defaultValue: "not-an-email",
    error: "올바른 이메일 형식이 아닙니다.",
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: "수정할 수 없음",
    disabled: true,
  },
};
