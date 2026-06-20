import { useState, useCallback, type FormEvent } from "react";
import { useNpcChat } from "../context/NpcChatContext";
import { MAX_QUESTION_LENGTH } from "../constants";

export default function NpcChatInput() {
  const { sendMessage, loading } = useNpcChat();
  const [text, setText] = useState("");

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!text.trim() || loading) return;
      sendMessage(text);
      setText("");
    },
    [text, loading, sendMessage]
  );

  return (
    <form className="npc-chat-input-row" onSubmit={handleSubmit}>
      <input
        className="npc-chat-input"
        value={text}
        maxLength={MAX_QUESTION_LENGTH}
        onChange={(e) => setText(e.target.value)}
        placeholder="궁금한 점을 입력하세요..."
        disabled={loading}
      />
      <button
        type="submit"
        className="npc-chat-send-btn"
        disabled={!text.trim() || loading}
        aria-label="전송"
      >
        {loading ? "..." : "전송"}
      </button>
    </form>
  );
}
