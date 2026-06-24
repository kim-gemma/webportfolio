import { useEffect, useRef, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://webportfolio-cv10.onrender.com";
const WS_URL = `${API_BASE_URL.replace(/^http/, "ws")}/ws/visitors`;

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

  useEffect(() => {
    unmountedRef.current = false;

    function connect(): void {
      setStatus("connecting");
      if (import.meta.env.DEV) {
        console.info("[online-visitors] connecting:", WS_URL);
      }
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
