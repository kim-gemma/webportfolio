import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "./Modal";
import { Button } from "../Button";

/**
 * `Modal`은 `isOpen`이 false일 때 아무것도 렌더링하지 않으므로, 항상 마운트해 두고
 * 상태만 토글해서 열고 닫을 수 있다. Esc 키와 배경 클릭으로도 닫힌다.
 */
function ModalDemo({ isOpen: initialOpen }: { isOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Contact Me">
        함께 일하고 싶으시거나 궁금한 점이 있으시면 편하게 연락 주세요.
      </Modal>
    </div>
  );
}

const meta = {
  title: "UI/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "false면 아무것도 렌더링하지 않는다",
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { isOpen: true, onClose: () => {}, children: null },
  render: () => <ModalDemo isOpen />,
};

export const Closed: Story = {
  args: { isOpen: false, onClose: () => {}, children: null },
  render: () => <ModalDemo isOpen={false} />,
};
