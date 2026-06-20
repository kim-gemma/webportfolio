export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 255;
export const MAX_MESSAGE_LENGTH = 5000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidName(name: unknown): name is string {
  return typeof name === "string" && name.trim().length > 0 && name.length <= MAX_NAME_LENGTH;
}

export function isValidMessage(message: unknown): message is string {
  return (
    typeof message === "string" &&
    message.trim().length > 0 &&
    message.length <= MAX_MESSAGE_LENGTH
  );
}

export function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" && email.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(email)
  );
}

export const MAX_CHAT_MESSAGE_LENGTH = 1000;
export const MAX_CHAT_HISTORY_LENGTH = 30;

export function isValidChatMessage(message: unknown): message is string {
  return (
    typeof message === "string" &&
    message.trim().length > 0 &&
    message.length <= MAX_CHAT_MESSAGE_LENGTH
  );
}

export interface ChatTurnInput {
  role: "user" | "model";
  text: string;
}

export function isValidChatHistory(history: unknown): history is ChatTurnInput[] {
  if (!Array.isArray(history) || history.length > MAX_CHAT_HISTORY_LENGTH) return false;
  return history.every(
    (turn) =>
      turn &&
      typeof turn === "object" &&
      (turn.role === "user" || turn.role === "model") &&
      typeof turn.text === "string" &&
      turn.text.length > 0 &&
      turn.text.length <= MAX_CHAT_MESSAGE_LENGTH
  );
}
