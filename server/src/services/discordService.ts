import { env } from "../config/env.js";

interface ContactNotificationInput {
  name: string;
  email: string | null;
  message: string;
  createdAt: Date;
}

/** Date를 한국 시간(Asia/Seoul) 기준 "YYYY-MM-DD HH:mm" 문자열로 변환한다. */
function formatTimestamp(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

/**
 * 새 문의가 도착했을 때 Discord 웹훅으로 알림을 보낸다.
 * DISCORD_WEBHOOK_URL이 설정되지 않았으면 조용히 건너뛴다.
 * 호출하는 쪽(contactService)에서 try/catch로 감싸므로, 여기서는 실패 시 그냥 예외를 던진다.
 */
export async function sendContactNotification({
  name,
  email,
  message,
  createdAt,
}: ContactNotificationInput): Promise<void> {
  if (!env.discordWebhookUrl) {
    console.warn("[discord] DISCORD_WEBHOOK_URL이 설정되지 않아 알림을 보내지 않습니다.");
    return;
  }

  const content = [
    "📨 새로운 문의가 도착했습니다",
    "",
    `👤 이름: ${name}`,
    `📧 이메일: ${email ?? "없음"}`,
    "",
    "💬 메시지:",
    message,
    "",
    "⏰ 시간:",
    formatTimestamp(createdAt),
  ].join("\n");

  const response = await fetch(env.discordWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`Discord webhook responded with status ${response.status}`);
  }
}
