import type { Server as HttpServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { env } from "../config/env.js";

const HEARTBEAT_INTERVAL_MS = 30_000;

interface VisitorSocket extends WebSocket {
  isAlive?: boolean;
}

/** 현재 접속 중인 모든 클라이언트. Set이라 추가/삭제/size 조회가 모두 O(1)이다. */
const clients = new Set<VisitorSocket>();

function broadcastOnlineCount(): void {
  const payload = JSON.stringify({ type: "online_count", count: clients.size });
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
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
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    clients.add(ws);
    broadcastOnlineCount();

    ws.on("close", () => {
      clients.delete(ws);
      broadcastOnlineCount();
    });

    ws.on("error", (err) => {
      console.error("[visitorSocket] socket error:", err);
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
