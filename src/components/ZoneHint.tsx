import { useGame } from "../context/GameContext";
import { useNpcChat } from "../npcChat/context/NpcChatContext";
import { ZONE_META } from "../config/zonesConfig";

export interface ZoneHintProps {
  /** true(모바일/터치 환경)일 때만 렌더링한다. 데스크톱은 Enter 키로 입장하므로 항상 null을 반환한다. */
  isMobile: boolean;
}

/**
 * 모바일 전용 "Zone 입장하기" 플로팅 버튼. 데스크톱은 기존처럼 Enter 키로 Zone에
 * 입장하므로 이 버튼이 필요 없다. 모바일에는 Enter 키가 없으므로, `hintZone`
 * (Phaser가 감지한 "근처 Zone")을 그대로 가져와 탭으로 `openZone`을 호출하는
 * 버튼을 띄운다. `activeZone`/`mailboxModalOpen`/`npcChatOpen` 중 하나라도 열려
 * 있으면 다른 모달과 겹치지 않도록 숨긴다.
 */
export default function ZoneHint({ isMobile }: ZoneHintProps) {
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
      style={{ "--zone-color": meta.color } as React.CSSProperties}
      onClick={() => openZone(hintZone)}
      aria-label={`${meta.title} 구역 입장하기`}
    >
      <span className="zone-hint-icon">{meta.icon}</span>
      <span>{meta.title}</span>
      <span className="zone-hint-key">입장하기</span>
    </button>
  );
}
