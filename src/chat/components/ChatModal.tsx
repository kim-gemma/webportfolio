import { useEffect } from "react";
import { useChat } from "../context/ChatContext";
import ContactForm from "./ContactForm";

export default function ChatModal() {
  const { chatOpen, closeChat } = useChat();

  useEffect(() => {
    if (!chatOpen) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.code === "Escape") closeChat();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chatOpen, closeChat]);

  if (!chatOpen) return null;

  return (
    <div className="modal-overlay chat-modal-overlay" onClick={closeChat}>
      <div className="modal-panel chat-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeChat} aria-label="닫기">
          ×
        </button>
        <div className="chat-modal-header">
          <span className="chat-modal-title">Contact Me</span>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
