import { env } from "../config/env.js";

export const corsOptions = {
  origin: env.allowedOrigins,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
