import { useEffect, useRef, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://webportfolio-cv10.onrender.com";
const WS_URL = `${API_BASE_URL.replace(/^http/, "ws")}/ws/visitors`;

const MAX_RECONNECT_DELAY_MS = 10_000;
const BASE_RECONNECT_DELAY_MS = 1_000;
const INITIAL_CONNECT_DELAY_MS = 100;
const LEGACY_TOTAL_VISITS_STORAGE_KEY = "portfolio_total_visits";
const LEGACY_VISIT_COUNTED_SESSION_KEY = "portfolio_visit_counted";
const VISITOR_ID_STORAGE_KEY = "portfolio_visitor_id";

export type VisitorSocketStatus = "connecting" | "connected" | "disconnected";

interface OnlineCountMessage {
  type: "online_count";
  count: number;
}

interface VisitorStatsMessage {
  type: "visitor_stats";
  onlineCount: number;
  totalVisits: number | null;
  todayVisits: number | null;
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
    (
      typeof (data as { totalVisits?: unknown }).totalVisits === "number" ||
      (data as { totalVisits?: unknown }).totalVisits === null
    )
  );
}

function createVisitorId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function getOrCreateVisitorId(): string {
  const stored = localStorage.getItem(VISITOR_ID_STORAGE_KEY);
  if (stored) return stored;

  const visitorId = createVisitorId();
  localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
  return visitorId;
}

export interface UseOnlineVisitorsResult {
  onlineCount: number | null;
  totalVisits: number | null;
  status: VisitorSocketStatus;
}

/** /ws/visitors에 연결해 실시간 접속자 수를 받아오고, 끊기면 지수 백오프로 재연결한다. */
export function useOnlineVisitors(): UseOnlineVisitorsResult {
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [status, setStatus] = useState<VisitorSocketStatus>("connecting");

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const unmountedRef = useRef(false);
  const intentionalCloseRef = useRef(false);

  useEffect(() => {
    localStorage.removeItem(LEGACY_TOTAL_VISITS_STORAGE_KEY);
    sessionStorage.removeItem(LEGACY_VISIT_COUNTED_SESSION_KEY);
  }, []);

  useEffect(() => {
    unmountedRef.current = false;

    function closeSocket(): void {
      const socket = socketRef.current;
      if (!socket) return;

      intentionalCloseRef.current = true;
      if (socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify({ type: "visitor_leave" }));
        } catch {
          // 페이지 종료 직전에는 send가 실패할 수 있으므로 close로 이어간다.
        }
        socket.close(1000, "visitor left");
      } else if (socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }

      socketRef.current = null;
    }

    function connect(): void {
      intentionalCloseRef.current = false;
      setStatus("connecting");
      setOnlineCount(null);
      setTotalVisits(null);
      if (import.meta.env.DEV) {
        console.info("[online-visitors] connecting:", WS_URL);
      }
      const visitorId = getOrCreateVisitorId();
      const socketUrl = new URL(WS_URL);
      socketUrl.searchParams.set("visitorId", visitorId);
      const socket = new WebSocket(socketUrl.toString());
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
        if (intentionalCloseRef.current) {
          setStatus("disconnected");
          return;
        }
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

    const initialConnectTimeout = setTimeout(connect, INITIAL_CONNECT_DELAY_MS);
    window.addEventListener("pagehide", closeSocket);
    window.addEventListener("beforeunload", closeSocket);

    return () => {
      unmountedRef.current = true;
      clearTimeout(initialConnectTimeout);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      window.removeEventListener("pagehide", closeSocket);
      window.removeEventListener("beforeunload", closeSocket);
      closeSocket();
    };
  }, []);

  return { onlineCount, totalVisits, status };
}
