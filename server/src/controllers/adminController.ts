import type { Request, Response } from "express";
import { listContactMessages } from "../db/contactRepository.js";
import {
  getVisitorStats,
  listRecentVisitorEvents,
  listRecentVisitorSessions,
} from "../db/visitorRepository.js";
import { getOnlineVisitorCount } from "../realtime/visitorSocket.js";

function parseLimit(value: unknown, fallback: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
}

export async function getAdminDashboard(req: Request, res: Response): Promise<void> {
  const limit = parseLimit(req.query.limit, 30, 100);

  try {
    const onlineCount = getOnlineVisitorCount();
    const [messages, stats, recentSessions, recentEvents] = await Promise.all([
      listContactMessages(limit),
      getVisitorStats(onlineCount),
      listRecentVisitorSessions(limit),
      listRecentVisitorEvents(limit),
    ]);

    res.json({
      success: true,
      data: {
        stats,
        messages,
        recentSessions,
        recentEvents,
      },
    });
  } catch (err) {
    console.error("[adminController] 관리자 대시보드 조회 실패:", err);
    res.status(500).json({ success: false, error: "Failed to load admin dashboard." });
  }
}
