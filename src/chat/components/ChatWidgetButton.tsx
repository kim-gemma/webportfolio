import { useChat } from "../context/ChatContext";
import { useGame } from "../../context/GameContext";

export default function ChatWidgetButton() {
  const { chatOpen, openChat } = useChat();
  const { isMobile, hintZone, mailboxNear, aiNpcNear } = useGame();

  if (chatOpen) return null;

  // 모바일에서는 Zone/Mailbox/AI NPC 입장 힌트 버튼이 화면 하단 중앙에 뜨는데,
  // Contact Me 버튼과 같은 높이라 겹친다. 입장 힌트가 더 우선이므로 그 동안은
  // Contact Me를 숨기고, 힌트가 사라지면(Zone 이탈 등) 다시 보여준다.
  if (isMobile && (hintZone || mailboxNear || aiNpcNear)) return null;

  return (
    <button className="chat-widget-button" onClick={openChat}>
      📬 Contact Me
    </button>
  );
}
