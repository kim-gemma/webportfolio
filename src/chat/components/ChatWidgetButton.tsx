import { useChat } from "../context/ChatContext";

export default function ChatWidgetButton() {
  const { chatOpen, openChat } = useChat();

  if (chatOpen) return null;

  return (
    <button className="chat-widget-button" onClick={openChat}>
      Contact
    </button>
  );
}
