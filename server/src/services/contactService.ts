import { insertContactMessage } from "../db/contactRepository.js";
import { sendContactNotification } from "./discordService.js";

export interface SubmitContactInput {
  name: string;
  email: string | null;
  message: string;
}

/**
 * 문의 저장 + Discord 알림을 묶어서 처리한다.
 * 동작 흐름: MySQL 저장 -> Discord 알림 전송 -> 호출자에게 반환(성공 응답은 컨트롤러가 보냄).
 *
 * 알림 전송은 best-effort로 처리한다: Discord가 다운되어 있어도
 * 문의 자체는 이미 DB에 저장되었으므로 사용자에게는 성공으로 응답해야 한다.
 */
export async function submitContactMessage(input: SubmitContactInput): Promise<void> {
  const record = await insertContactMessage(input.name, input.email, input.message);

  try {
    await sendContactNotification({
      name: record.name,
      email: record.email,
      message: record.message,
      createdAt: record.createdAt,
    });
  } catch (err) {
    console.error("[contactService] Discord 알림 전송 실패:", err);
  }
}
