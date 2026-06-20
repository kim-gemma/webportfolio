import http from "node:http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { corsOptions } from "./middleware/cors.js";
import { healthRouter } from "./routes/health.js";
import { contactRouter } from "./routes/contactRoutes.js";
import { npcChatRouter } from "./routes/npcChatRoutes.js";
import { attachVisitorSocket } from "./realtime/visitorSocket.js";

const app = express();
// Render 등 리버스 프록시 뒤에서 실행되므로, X-Forwarded-For 헤더를 신뢰하도록 설정
// (express-rate-limit이 이 설정 없이는 프록시 환경에서 에러를 던진다)
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: true, legacyHeaders: false }));

app.use(healthRouter);
app.use(contactRouter);
app.use(npcChatRouter);

// WebSocket(/ws/visitors)이 같은 포트에서 업그레이드 요청을 받도록
// express 앱을 직접 listen하지 않고 http.Server를 통해 감싼다.
const server = http.createServer(app);
const wss = attachVisitorSocket(server);

server.listen(env.port, () => {
  console.log(`Contact server listening on port ${env.port}`);
  console.log(`Allowed CORS origins: ${env.allowedOrigins.join(", ")}`);
  console.log(`Gemini model in use: ${env.geminiModel}`);
});

// Render는 재배포/재시작 시 SIGTERM을 보낸다. 소켓을 정리하지 않으면
// 재시작 시 끊긴 연결이 정리되지 않고 프로세스 종료가 지연될 수 있다.
function shutdown(): void {
  wss.close();
  server.close(() => process.exit(0));
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
