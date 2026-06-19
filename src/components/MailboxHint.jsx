import { useGame } from "../context/GameContext";

export default function MailboxHint({ isMobile }) {
  const { mailboxNear, activeZone, mailboxModalOpen, openMailboxModal } = useGame();

  if (!mailboxNear || activeZone || mailboxModalOpen) return null;

  return (
    <button
      type="button"
      className="zone-hint mailbox-hint"
      onClick={openMailboxModal}
      aria-label="우편함 열기: 이력서 및 포트폴리오 다운로드"
    >
      <span className="zone-hint-icon">📮</span>
      <span>Mailbox</span>
      <span className="zone-hint-key">{isMobile ? "탭하여 열기" : "Enter ↵"}</span>
    </button>
  );
}
