import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "./pool.js";

export interface ContactMessageRecord {
  id: number;
  name: string;
  email: string | null;
  message: string;
  createdAt: Date;
}

export interface ContactMessageListItem {
  id: number;
  name: string;
  email: string | null;
  message: string;
  createdAt: string;
}

interface ContactMessageRow extends RowDataPacket {
  id: number;
  name: string;
  email: string | null;
  message: string;
  created_at: Date;
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

export async function listContactMessages(limit = 50): Promise<ContactMessageListItem[]> {
  const [rows] = await pool.query<ContactMessageRow[]>(
    `SELECT id, name, email, message, created_at
     FROM contact_messages
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit]
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at.toISOString(),
  }));
}
