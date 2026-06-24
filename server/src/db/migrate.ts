import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pool } from "./pool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, "schema.sql"), "utf-8");

async function ensureVisitorIdColumn() {
  const [columns] = await pool.query(
    "SHOW COLUMNS FROM visitor_sessions LIKE 'visitor_id'"
  );
  if (Array.isArray(columns) && columns.length === 0) {
    await pool.query("ALTER TABLE visitor_sessions ADD COLUMN visitor_id VARCHAR(64) NULL AFTER session_id");
  }

  const [indexes] = await pool.query(
    "SHOW INDEX FROM visitor_sessions WHERE Key_name = 'idx_visitor_sessions_visitor_id'"
  );
  if (Array.isArray(indexes) && indexes.length === 0) {
    await pool.query("ALTER TABLE visitor_sessions ADD INDEX idx_visitor_sessions_visitor_id (visitor_id)");
  }
}

async function ensureIsNewVisitColumn() {
  const [columns] = await pool.query(
    "SHOW COLUMNS FROM visitor_sessions LIKE 'is_new_visit'"
  );
  if (Array.isArray(columns) && columns.length === 0) {
    await pool.query(
      "ALTER TABLE visitor_sessions ADD COLUMN is_new_visit TINYINT(1) NOT NULL DEFAULT 1 AFTER last_seen_at"
    );
  }
}

async function migrate() {
  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }

  await ensureVisitorIdColumn();
  await ensureIsNewVisitColumn();

  console.log("Migration complete: portfolio operation tables are ready.");
  await pool.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
