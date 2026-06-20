import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { corsOptions } from "./middleware/cors.js";
import { healthRouter } from "./routes/health.js";
import { contactRouter } from "./routes/contactRoutes.js";

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

app.listen(env.port, () => {
  console.log(`Contact server listening on port ${env.port}`);
  console.log(`Allowed CORS origins: ${env.allowedOrigins.join(", ")}`);
});
