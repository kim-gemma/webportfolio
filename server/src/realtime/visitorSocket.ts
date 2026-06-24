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

const HEARTBEAT_INTERVAL_MS = 10_000;

interface VisitorSocket extends WebSocket {
  isAlive?: boolean;
  sessionId?: string;
  visitorId?: string;
  cleanedUp?: boolean;
}

/** 현재 접속 중인 모든 클라이언트. Set이라 추가/삭제/size 조회가 모두 O(1)이다. */
const clients = new Set<VisitorSocket>();

export function getOnlineVisitorCount(): number {
  return clients.size;
}

async function broadcastVisitorStats(): Promise<void> {
  const stats = await getVisitorStats(clients.size).catch((err) => {
    console.error("[visitorSocket] visitor stats 조회 실패:", err);
    return {
      onlineCount: clients.size,
      totalVisits: null,
      todayVisits: null,
    };
  });

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

function getVisitorId(req: IncomingMessage, fallbackId: string): string {
  const url = new URL(req.url ?? "/", "http://localhost");
  const visitorId = url.searchParams.get("visitorId");
  if (!visitorId || visitorId.length > 64) return fallbackId;
  return visitorId;
}

function cleanupVisitorSocket(ws: VisitorSocket): void {
  if (ws.cleanedUp) return;
  ws.cleanedUp = true;
  clients.delete(ws);

  if (ws.sessionId) {
    recordVisitorDisconnect(ws.sessionId, clients.size).catch((err) => {
      console.error("[visitorSocket] 종료 기록 실패:", err);
    });
  }

  broadcastVisitorStatsSafely();
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
    ws.visitorId = getVisitorId(req, ws.sessionId);
    ws.on("pong", () => {
      ws.isAlive = true;
      if (ws.sessionId) {
        recordVisitorHeartbeat(ws.sessionId, clients.size).catch((err) => {
          console.error("[visitorSocket] heartbeat 기록 실패:", err);
        });
      }
    });

    ws.on("message", (rawMessage) => {
      try {
        const message = JSON.parse(rawMessage.toString()) as { type?: unknown };
        if (message.type === "visitor_leave") {
          cleanupVisitorSocket(ws);
          ws.close(1000, "visitor left");
        }
      } catch {
        // visitor counter와 무관한 메시지는 무시한다.
      }
    });

    clients.add(ws);
    recordVisitorConnect({
      sessionId: ws.sessionId,
      visitorId: ws.visitorId,
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"]?.slice(0, 512) ?? null,
      onlineCount: clients.size,
    })
      .catch((err) => {
        console.error("[visitorSocket] 접속 기록 실패:", err);
      })
      .finally(broadcastVisitorStatsSafely);

    ws.on("close", () => {
      cleanupVisitorSocket(ws);
    });

    ws.on("error", (err) => {
      console.error("[visitorSocket] socket error:", err);
      cleanupVisitorSocket(ws);
    });
  });

  // 비정상 종료(네트워크 끊김, 모바일 백그라운드 전환 등)로 close 이벤트 없이
  // 죽은 소켓이 Set에 남아 메모리 누수가 생기는 것을 막기 위한 핑/퐁 헬스체크.
  const heartbeat = setInterval(() => {
    for (const ws of clients) {
      if (ws.isAlive === false) {
        cleanupVisitorSocket(ws);
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
