import { useEffect, useRef } from "react";
import { useNpcChat } from "../context/NpcChatContext";

export default function NpcChatMessageList() {
  const { messages, loading } = useNpcChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  return (
    <div className="npc-chat-messages">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`npc-chat-bubble ${m.role === "user" ? "npc-chat-bubble-user" : "npc-chat-bubble-model"}`}
        >
          {m.text}
        </div>
      ))}
      {loading && (
        <div className="npc-chat-bubble npc-chat-bubble-model npc-chat-bubble-loading">
          <span className="npc-chat-dot" />
          <span className="npc-chat-dot" />
          <span className="npc-chat-dot" />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
