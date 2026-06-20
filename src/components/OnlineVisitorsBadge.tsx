import { useOnlineVisitors } from "../hooks/useOnlineVisitors";

const STATUS_LABEL: Record<string, string> = {
  connecting: "연결 중...",
  connected: "Online",
  disconnected: "재연결 중...",
};

export default function OnlineVisitorsBadge() {
  const { onlineCount, totalVisits, status } = useOnlineVisitors();

  return (
    <div className="online-visitors-badge" role="status" aria-live="polite">
      <div className="online-visitors-row">
        <span className={`online-status-dot online-status-dot-${status}`} aria-hidden="true" />
        <span>
          {STATUS_LABEL[status]}
          {status === "connected" ? ` ${onlineCount}` : ""}
        </span>
      </div>
      <div className="online-visitors-row online-visitors-total">
        <span aria-hidden="true">📈</span>
        <span>Total Visits {totalVisits}</span>
      </div>
    </div>
  );
}
