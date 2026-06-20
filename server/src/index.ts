import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { corsOptions } from "./middleware/cors.js";
import { healthRouter } from "./routes/health.js";
import { contactRouter } from "./routes/contactRoutes.js";

const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: true, legacyHeaders: false }));

app.use(healthRouter);
app.use(contactRouter);

app.listen(env.port, () => {
  console.log(`Contact server listening on port ${env.port}`);
});
