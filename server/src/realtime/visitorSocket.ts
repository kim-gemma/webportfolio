import type { IncomingMessage, Server as HttpServer } from "node:http";
import { randomUUID } from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";
import { env } from "../config/env.js";
import {
  getVisitorStats,
  recordVisitorConnect,
  recordVisitorDisconnect,
  recordVisitorHeartbeat,
} from "../db/visitorRepository.js";

const HEARTBEAT_INTERVAL_MS = 30_000;

interface VisitorSocket extends WebSocket {
  isAlive?: boolean;
  sessionId?: string;
}

/** 현재 접속 중인 모든 클라이언트. Set이라 추가/삭제/size 조회가 모두 O(1)이다. */
const clients = new Set<VisitorSocket>();

export function getOnlineVisitorCount(): number {
  return clients.size;
}

async function broadcastVisitorStats(): Promise<void> {
  const stats = await getVisitorStats(clients.size);
  const payload = JSON.stringify({
    type: "visitor_stats",
    onlineCount: stats.onlineCount,
    totalVisits: stats.totalVisits,
    todayVisits: stats.todayVisits,
  });

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function broadcastVisitorStatsSafely(): void {
  broadcastVisitorStats().catch((err) => {
    console.error("[visitorSocket] failed to broadcast visitor stats:", err);
  });
}

function getClientIp(req: IncomingMessage): string | null {
  const forwardedFor = req?.headers?.["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }
  return req?.socket?.remoteAddress ?? null;
}

/**
 * /ws/visitors 경로에 WebSocket 서버를 붙여 실시간 접속자 수를 관리한다.
 * 별도 포트를 열지 않고 기존 HTTP 서버에 업그레이드 요청만 위임받는 방식
 * (Render는 서비스당 단일 포트만 외부에 노출하므로 이 방식이 필수).
 */
export function attachVisitorSocket(server: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server, path: "/ws/visitors" });

  wss.on("connection", (ws: VisitorSocket, req) => {
    // 브라우저는 항상 Origin 헤더를 보내므로, 보낸 경우에만 허용 목록과 대조한다
    // (curl 등 비브라우저 클라이언트는 헤더가 없을 수 있으므로 그 경우는 통과시킨다).
    const origin = req.headers.origin;
    if (origin && !env.allowedOrigins.includes(origin)) {
      ws.close(1008, "Origin not allowed");
      return;
    }

    ws.isAlive = true;
    ws.sessionId = randomUUID();
    ws.on("pong", () => {
      ws.isAlive = true;
      if (ws.sessionId) {
        recordVisitorHeartbeat(ws.sessionId, clients.size).catch((err) => {
          console.error("[visitorSocket] heartbeat 기록 실패:", err);
        });
      }
    });

    clients.add(ws);
    recordVisitorConnect({
      sessionId: ws.sessionId,
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"]?.slice(0, 512) ?? null,
      onlineCount: clients.size,
    })
      .catch((err) => {
        console.error("[visitorSocket] 접속 기록 실패:", err);
      })
      .finally(broadcastVisitorStatsSafely);

    ws.on("close", () => {
      clients.delete(ws);
      if (ws.sessionId) {
        recordVisitorDisconnect(ws.sessionId, clients.size).catch((err) => {
          console.error("[visitorSocket] 종료 기록 실패:", err);
        });
      }
      broadcastVisitorStatsSafely();
    });

    ws.on("error", (err) => {
      console.error("[visitorSocket] socket error:", err);
      // ws 라이브러리는 error 이후 보통 close도 내보내지만, 혹시 close가 누락되는
      // 경우를 대비해 여기서도 명시적으로 정리한다 (Set.delete는 이미 없으면 무해함).
      clients.delete(ws);
      broadcastVisitorStatsSafely();
    });
  });

  // 비정상 종료(네트워크 끊김, 모바일 백그라운드 전환 등)로 close 이벤트 없이
  // 죽은 소켓이 Set에 남아 메모리 누수가 생기는 것을 막기 위한 핑/퐁 헬스체크.
  const heartbeat = setInterval(() => {
    for (const ws of clients) {
      if (ws.isAlive === false) {
        ws.terminate();
        continue;
      }
      ws.isAlive = false;
      ws.ping();
    }
  }, HEARTBEAT_INTERVAL_MS);

  wss.on("close", () => {
    clearInterval(heartbeat);
  });

  return wss;
}
