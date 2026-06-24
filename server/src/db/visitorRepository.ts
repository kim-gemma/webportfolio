import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "./pool.js";

export interface VisitorStats {
  onlineCount: number;
  totalVisits: number | null;
  todayVisits: number | null;
}

export interface RecentVisitorSession {
  sessionId: string;
  ipAddress: string | null;
  userAgent: string | null;
  connectedAt: string;
  disconnectedAt: string | null;
  lastSeenAt: string;
}

export interface VisitorEventLog {
  id: number;
  sessionId: string;
  eventType: "connect" | "disconnect" | "heartbeat";
  onlineCount: number;
  createdAt: string;
}

interface CountRow extends RowDataPacket {
  total: number;
}

interface VisitorSessionRow extends RowDataPacket {
  session_id: string;
  ip_address: string | null;
  user_agent: string | null;
  connected_at: Date;
  disconnected_at: Date | null;
  last_seen_at: Date;
}

interface VisitorEventRow extends RowDataPacket {
  id: number;
  session_id: string;
  event_type: "connect" | "disconnect" | "heartbeat";
  online_count: number;
  created_at: Date;
}

function toIsoString(value: Date): string {
  return value.toISOString();
}

export async function recordVisitorConnect(input: {
  sessionId: string;
  ipAddress: string | null;
  userAgent: string | null;
  onlineCount: number;
}): Promise<void> {
  await pool.query<ResultSetHeader>(
    `INSERT INTO visitor_sessions (session_id, ip_address, user_agent)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE last_seen_at = CURRENT_TIMESTAMP, disconnected_at = NULL`,
    [input.sessionId, input.ipAddress, input.userAgent]
  );
  await insertVisitorEvent(input.sessionId, "connect", input.onlineCount);
}

export async function recordVisitorDisconnect(sessionId: string, onlineCount: number): Promise<void> {
  await pool.query<ResultSetHeader>(
    `UPDATE visitor_sessions
     SET disconnected_at = CURRENT_TIMESTAMP, last_seen_at = CURRENT_TIMESTAMP
     WHERE session_id = ?`,
    [sessionId]
  );
  await insertVisitorEvent(sessionId, "disconnect", onlineCount);
}

export async function recordVisitorHeartbeat(sessionId: string, onlineCount: number): Promise<void> {
  await pool.query<ResultSetHeader>(
    "UPDATE visitor_sessions SET last_seen_at = CURRENT_TIMESTAMP WHERE session_id = ?",
    [sessionId]
  );
  await insertVisitorEvent(sessionId, "heartbeat", onlineCount);
}

async function insertVisitorEvent(
  sessionId: string,
  eventType: VisitorEventLog["eventType"],
  onlineCount: number
): Promise<void> {
  await pool.query<ResultSetHeader>(
    "INSERT INTO visitor_events (session_id, event_type, online_count) VALUES (?, ?, ?)",
    [sessionId, eventType, onlineCount]
  );
}

export async function getVisitorStats(onlineCount: number): Promise<VisitorStats> {
  const [[totalRow]] = await pool.query<CountRow[]>(
    "SELECT COUNT(*) AS total FROM visitor_sessions"
  );
  const [[todayRow]] = await pool.query<CountRow[]>(
    "SELECT COUNT(*) AS total FROM visitor_sessions WHERE DATE(connected_at) = CURRENT_DATE()"
  );

  return {
    onlineCount,
    totalVisits: totalRow?.total ?? 0,
    todayVisits: todayRow?.total ?? 0,
  };
}

export async function listRecentVisitorSessions(limit = 20): Promise<RecentVisitorSession[]> {
  const [rows] = await pool.query<VisitorSessionRow[]>(
    `SELECT session_id, ip_address, user_agent, connected_at, disconnected_at, last_seen_at
     FROM visitor_sessions
     ORDER BY connected_at DESC
     LIMIT ?`,
    [limit]
  );

  return rows.map((row) => ({
    sessionId: row.session_id,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    connectedAt: toIsoString(row.connected_at),
    disconnectedAt: row.disconnected_at ? toIsoString(row.disconnected_at) : null,
    lastSeenAt: toIsoString(row.last_seen_at),
  }));
}

export async function listRecentVisitorEvents(limit = 30): Promise<VisitorEventLog[]> {
  const [rows] = await pool.query<VisitorEventRow[]>(
    `SELECT id, session_id, event_type, online_count, created_at
     FROM visitor_events
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit]
  );

  return rows.map((row) => ({
    id: row.id,
    sessionId: row.session_id,
    eventType: row.event_type,
    onlineCount: row.online_count,
    createdAt: toIsoString(row.created_at),
  }));
}
