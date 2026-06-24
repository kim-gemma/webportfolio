import { useCallback, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://webportfolio-cv10.onrender.com";

interface ContactMessage {
  id: number;
  name: string;
  email: string | null;
  message: string;
  createdAt: string;
}

interface VisitorSession {
  sessionId: string;
  ipAddress: string | null;
  userAgent: string | null;
  connectedAt: string;
  disconnectedAt: string | null;
  lastSeenAt: string;
}

interface VisitorEvent {
  id: number;
  sessionId: string;
  eventType: "connect" | "disconnect" | "heartbeat";
  onlineCount: number;
  createdAt: string;
}

interface AdminDashboardData {
  stats: {
    onlineCount: number;
    totalVisits: number;
    todayVisits: number;
  };
  messages: ContactMessage[];
  recentSessions: VisitorSession[];
  recentEvents: VisitorEvent[];
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const hasData = Boolean(data);
  const metricItems = useMemo(
    () => [
      { label: "현재 접속자", value: data?.stats.onlineCount ?? 0 },
      { label: "누적 방문자", value: data?.stats.totalVisits ?? 0 },
      { label: "오늘 방문자", value: data?.stats.todayVisits ?? 0 },
      { label: "문의 수", value: data?.messages.length ?? 0 },
    ],
    [data]
  );

  const loadDashboard = useCallback(async () => {
    if (!token.trim()) {
      setError("관리자 토큰을 입력해주세요.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: { "x-admin-token": token.trim() },
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "관리자 데이터를 불러오지 못했습니다.");
      }

      setData(payload.data);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "관리자 데이터를 불러오지 못했습니다.");
    }
  }, [token]);

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div>
          <p className="admin-kicker">AWS Operations</p>
          <h1>Pixel Garden Admin</h1>
          <p>
            문의 내역, 실시간 방문자 수, 누적 방문자 수, 최근 접속 로그를 확인하는 운영 대시보드입니다.
          </p>
        </div>
        <a className="admin-home-link" href="/">
          Portfolio
        </a>
      </section>

      <section className="admin-auth-panel" aria-label="관리자 인증">
        <input
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") loadDashboard();
          }}
          placeholder="ADMIN_API_TOKEN"
          aria-label="관리자 토큰"
        />
        <button type="button" onClick={loadDashboard} disabled={status === "loading"}>
          {status === "loading" ? "Loading..." : "Load Dashboard"}
        </button>
      </section>

      {status === "error" && <p className="admin-error">{error}</p>}

      {hasData && (
        <>
          <section className="admin-metrics" aria-label="방문자 통계">
            {metricItems.map((item) => (
              <article className="admin-metric" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value.toLocaleString("ko-KR")}</strong>
              </article>
            ))}
          </section>

          <section className="admin-grid">
            <article className="admin-panel">
              <h2>문의 내역</h2>
              <div className="admin-list">
                {data?.messages.map((message) => (
                  <div className="admin-list-item" key={message.id}>
                    <div className="admin-list-heading">
                      <strong>{message.name}</strong>
                      <span>{formatDate(message.createdAt)}</span>
                    </div>
                    <p>{message.email ?? "No email"}</p>
                    <p>{message.message}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-panel">
              <h2>최근 접속 현황</h2>
              <div className="admin-list">
                {data?.recentSessions.map((session) => (
                  <div className="admin-list-item" key={session.sessionId}>
                    <div className="admin-list-heading">
                      <strong>{session.ipAddress ?? "Unknown IP"}</strong>
                      <span>{formatDate(session.connectedAt)}</span>
                    </div>
                    <p>Last seen: {formatDate(session.lastSeenAt)}</p>
                    <p>{session.userAgent ?? "Unknown user agent"}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-panel admin-panel-wide">
              <h2>접속 이벤트 로그</h2>
              <div className="admin-event-table" role="table">
                <div className="admin-event-row admin-event-row-head" role="row">
                  <span>Time</span>
                  <span>Event</span>
                  <span>Online</span>
                  <span>Session</span>
                </div>
                {data?.recentEvents.map((event) => (
                  <div className="admin-event-row" role="row" key={event.id}>
                    <span>{formatDate(event.createdAt)}</span>
                    <span>{event.eventType}</span>
                    <span>{event.onlineCount}</span>
                    <span>{event.sessionId.slice(0, 8)}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
}
