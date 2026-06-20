import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL ?? "",
  mysqlHost: process.env.MYSQL_HOST ?? "localhost",
  mysqlPort: Number(process.env.MYSQL_PORT) || 3306,
  mysqlUser: process.env.MYSQL_USER ?? "root",
  mysqlPassword: process.env.MYSQL_PASSWORD ?? "",
  mysqlDatabase: process.env.MYSQL_DATABASE ?? "webportfolio",
  allowedOrigins: required("ALLOWED_ORIGINS")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  // 비워두면 알림 전송을 건너뛴다 (선택 기능이므로 필수값으로 강제하지 않음)
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL ?? "",
  // NPC AI 챗봇용 Gemini API 키 (비워두면 /api/npc-chat 호출 시 503을 반환한다)
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
};
