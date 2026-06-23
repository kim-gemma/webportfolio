import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";
import { Badge } from "../Badge";

/**
 * `Card`는 Projects/Skills 같은 목록 항목을 감싸는 기본 컨테이너다.
 */
const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "코드 정원 포트폴리오",
    children:
      "React와 Phaser.js를 결합해 캐릭터가 맵을 탐험하며 정보를 발견하는 게임형 인터랙션으로 구현했습니다.",
  },
};

export const WithFooter: Story = {
  args: {
    title: "Design System & Storybook",
    children: "재사용 가능한 UI 컴포넌트를 디자인 토큰 기반으로 문서화했습니다.",
    footer: <Badge variant="accent">Storybook</Badge>,
  },
};
