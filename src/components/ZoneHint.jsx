import { useGame } from "../context/GameContext";
import { useNpcChat } from "../npcChat/context/NpcChatContext";
import { ZONE_META } from "../config/zonesConfig";

// 데스크톱은 기존처럼 Enter 키로 Zone에 입장하므로 이 버튼이 필요 없다.
// 모바일에는 Enter 키가 없으므로, hintZone(Phaser가 감지한 "근처 Zone")을
// 그대로 가져와 탭으로 openZone을 호출하는 버튼을 띄운다.
export default function ZoneHint({ isMobile }) {
  const { hintZone, activeZone, mailboxModalOpen, openZone } = useGame();
  const { npcChatOpen } = useNpcChat();

  if (!isMobile) return null;
  if (!hintZone || activeZone || mailboxModalOpen || npcChatOpen) return null;

  const meta = ZONE_META[hintZone];
  if (!meta) return null;

  return (
    <button
      type="button"
      className="zone-hint zone-enter-hint"
      style={{ "--zone-color": meta.color }}
      onClick={() => openZone(hintZone)}
      aria-label={`${meta.title} 구역 입장하기`}
    >
      <span className="zone-hint-icon">{meta.icon}</span>
      <span>{meta.title}</span>
      <span className="zone-hint-key">입장하기</span>
    </button>
  );
}
