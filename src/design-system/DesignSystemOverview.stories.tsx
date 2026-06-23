import type { Meta, StoryObj } from "@storybook/react-vite";
import { DesignSystemOverview } from "./DesignSystemOverview";

const meta = {
  title: "Design System/Overview",
  component: DesignSystemOverview,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    // 이 스토리 자체가 이미 설명 문서이므로 자동 생성되는 Docs 페이지의
    // 컴포넌트 설명/Props 표는 굳이 보여줄 필요가 없다.
    docs: { description: { component: undefined } },
  },
} satisfies Meta<typeof DesignSystemOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
