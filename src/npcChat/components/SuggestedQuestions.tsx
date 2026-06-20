import { useNpcChat } from "../context/NpcChatContext";
import { SUGGESTED_QUESTIONS } from "../constants";

export default function SuggestedQuestions() {
  const { sendMessage, loading } = useNpcChat();

  return (
    <div className="npc-chat-suggestions">
      {SUGGESTED_QUESTIONS.map((q) => (
        <button
          key={q}
          type="button"
          className="npc-chat-suggestion-btn"
          disabled={loading}
          onClick={() => sendMessage(q)}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
