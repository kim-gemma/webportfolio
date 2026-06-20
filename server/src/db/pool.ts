import "dotenv/config";
import mysql from "mysql2/promise";

// DATABASE_URL이 있으면 우선 사용 (Railway 등에서 발급하는 단일 연결 문자열),
// 없으면 개별 MYSQL_* 필드로 접속한다.
export const pool = process.env.DATABASE_URL
  ? mysql.createPool(process.env.DATABASE_URL)
  : mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "webportfolio",
    });