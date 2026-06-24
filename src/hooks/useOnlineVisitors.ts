import { useEffect, useRef, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://webportfolio-cv10.onrender.com";
const WS_URL = `${API_BASE_URL.replace(/^http/, "ws")}/ws/visitors`;

const TOTAL_VISITS_STORAGE_KEY = "portfolio_total_visits";
const VISIT_COUNTED_SESSION_KEY = "portfolio_visit_counted";

const MAX_RECONNECT_DELAY_MS = 10_000;
const BASE_RECONNECT_DELAY_MS = 1_000;

export type VisitorSocketStatus = "connecting" | "connected" | "disconnected";

interface OnlineCountMessage {
  type: "online_count";
  count: number;
}

interface VisitorStatsMessage {
  type: "visitor_stats";
  onlineCount: number;
  totalVisits: number;
  todayVisits: number;
}

function isOnlineCountMessage(data: unknown): data is OnlineCountMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { type?: unknown }).type === "online_count" &&
    typeof (data as { count?: unknown }).count === "number"
  );
}

function isVisitorStatsMessage(data: unknown): data is VisitorStatsMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { type?: unknown }).type === "visitor_stats" &&
    typeof (data as { onlineCount?: unknown }).onlineCount === "number" &&
    typeof (data as { totalVisits?: unknown }).totalVisits === "number"
  );
}

export interface UseOnlineVisitorsResult {
  onlineCount: number;
  totalVisits: number;
  status: VisitorSocketStatus;
}

/** /ws/visitors에 연결해 실시간 접속자 수를 받아오고, 끊기면 지수 백오프로 재연결한다. */
export function useOnlineVisitors(): UseOnlineVisitorsResult {
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [status, setStatus] = useState<VisitorSocketStatus>("connecting");

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const unmountedRef = useRef(false);

  useEffect(() => {
    // 새로고침해도 누적되도록 localStorage에 저장하되, 같은 탭에서
    // 리렌더/StrictMode로 두 번 세는 것을 막기 위해 세션당 1회만 증가시킨다.
    const alreadyCountedThisSession = sessionStorage.getItem(VISIT_COUNTED_SESSION_KEY);
    const stored = Number(localStorage.getItem(TOTAL_VISITS_STORAGE_KEY) ?? "0");

    if (alreadyCountedThisSession) {
      setTotalVisits(stored);
    } else {
      const next = stored + 1;
      localStorage.setItem(TOTAL_VISITS_STORAGE_KEY, String(next));
      sessionStorage.setItem(VISIT_COUNTED_SESSION_KEY, "1");
      setTotalVisits(next);
    }
  }, []);

  useEffect(() => {
    unmountedRef.current = false;

    function connect(): void {
      setStatus("connecting");
      const socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        if (unmountedRef.current) return;
        reconnectAttemptsRef.current = 0;
        setStatus("connected");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (isVisitorStatsMessage(data)) {
            setOnlineCount(data.onlineCount);
            setTotalVisits(data.totalVisits);
          } else if (isOnlineCountMessage(data)) {
            setOnlineCount(data.count);
          }
        } catch {
          // 잘못된 형식의 메시지는 무시한다
        }
      };

      socket.onclose = () => {
        if (unmountedRef.current) return;
        setStatus("disconnected");
        scheduleReconnect();
      };

      socket.onerror = () => {
        socket.close();
      };
    }

    function scheduleReconnect(): void {
      const attempt = reconnectAttemptsRef.current;
      const delay = Math.min(BASE_RECONNECT_DELAY_MS * 2 ** attempt, MAX_RECONNECT_DELAY_MS);
      reconnectAttemptsRef.current = attempt + 1;
      reconnectTimeoutRef.current = setTimeout(connect, delay);
    }

    connect();

    return () => {
      unmountedRef.current = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      socketRef.current?.close();
    };
  }, []);

  return { onlineCount, totalVisits, status };
}
