import { useGame } from "../context/GameContext";
import { useNpcChat } from "../npcChat/context/NpcChatContext";
import { useChat } from "../chat/context/ChatContext";
import OnlineVisitorsBadge from "./OnlineVisitorsBadge";
import ChatWidgetButton from "../chat/components/ChatWidgetButton";

// Online Visitors 배지 + Contact 버튼을 우측 하단에 하나의 Floating Action
// Area로 쌓아 보여준다. Zone/Mailbox/AI 챗봇/Contact 모달, 모바일 메뉴, Docs 모달
// 중 하나라도 열려 있으면 통째로 숨겨서 겹치지 않게 한다.
export default function FloatingActionArea({ gameStarted }) {
  const { activeZone, mailboxModalOpen, mobileMenuOpen } = useGame();
  const { npcChatOpen } = useNpcChat();
  const { chatOpen } = useChat();

  const anyModalOpen = Boolean(
    activeZone || mailboxModalOpen || npcChatOpen || chatOpen || mobileMenuOpen
  );
  if (anyModalOpen) return null;

  return (
    <div className="floating-action-area">
      <OnlineVisitorsBadge />
      {gameStarted && <ChatWidgetButton />}
      
    </div>
  );
}
