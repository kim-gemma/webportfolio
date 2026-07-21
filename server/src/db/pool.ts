import "dotenv/config";
import mysql from "mysql2/promise";

// TiDB Cloud Serverless는 TLS 연결을 요구한다. 인증서는 공인 CA(Amazon Trust)로
// 서명되어 있어 Node의 기본 신뢰 저장소로 검증되므로 별도 CA 파일이 필요 없다.
const ssl = { minVersion: "TLSv1.2" as const, rejectUnauthorized: true };

// DATABASE_URL이 있으면 우선 사용, 없으면 개별 MYSQL_* 필드로 접속한다.
export const pool = process.env.DATABASE_URL
  ? mysql.createPool(process.env.DATABASE_URL)
  : mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "webportfolio",
      ssl,
    });