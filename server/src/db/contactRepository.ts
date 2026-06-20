import type { ResultSetHeader } from "mysql2";
import { pool } from "./pool.js";

export interface ContactMessageRecord {
  id: number;
  name: string;
  email: string | null;
  message: string;
  createdAt: Date;
}

/**
 * 문의 내용을 contact_messages 테이블에 저장한다.
 * SQL Injection 방지를 위해 Prepared Statement(물음표 바인딩)만 사용한다.
 */
export async function insertContactMessage(
  name: string,
  email: string | null,
  message: string
): Promise<ContactMessageRecord> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
    [name, email, message]
  );

  return {
    id: result.insertId,
    name,
    email,
    message,
    createdAt: new Date(),
  };
}
