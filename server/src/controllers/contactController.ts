import type { Request, Response } from "express";
import { isValidName, isValidMessage, isValidEmail } from "../middleware/validation.js";
import { submitContactMessage } from "../services/contactService.js";

/** POST /api/contact 요청을 처리한다. */
export async function createContactMessage(req: Request, res: Response): Promise<void> {
  const { name, email, message } = req.body ?? {};

  // name, message는 필수값
  if (!isValidName(name) || !isValidMessage(message)) {
    res.status(400).json({ success: false, error: "Name and message are required." });
    return;
  }

  // email은 선택값이지만, 입력했다면 형식은 맞아야 한다
  const trimmedEmail = typeof email === "string" ? email.trim() : "";
  if (trimmedEmail && !isValidEmail(trimmedEmail)) {
    res.status(400).json({ success: false, error: "Email is invalid." });
    return;
  }

  try {
    await submitContactMessage({
      name: name.trim(),
      email: trimmedEmail || null,
      message: message.trim(),
    });
    res.json({ success: true });
  } catch (err) {
    console.error("[contactController] 문의 저장 실패:", err);
    res.status(500).json({ success: false, error: "Failed to save message." });
  }
}
