import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

/**
 * `Badge`는 태그/카테고리/상태를 표시하는 작은 라벨이다. `OnlineVisitorsBadge`의
 * 상태 점과 같은 색상 의미(success/danger)를 공유한다.
 */
const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "accent", "success", "danger"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: "default", children: "React" },
};

export const Accent: Story = {
  args: { variant: "accent", children: "Storybook" },
};

export const Success: Story = {
  args: { variant: "success", children: "Online" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Error" },
};
