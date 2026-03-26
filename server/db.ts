import dotenv from "dotenv";
import path from "path";

// Load .env from project root (dev only — Render injects env vars directly)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Please provision a PostgreSQL database and set the DATABASE_URL environment variable.",
  );
}

// Mask credentials in log — show only host/db for debugging, never the password
const dbUrlForLog = (() => {
  try {
    const u = new URL(process.env.DATABASE_URL!);
    return `${u.protocol}//${u.host}${u.pathname}`;
  } catch {
    return "[invalid url]";
  }
})();
console.log(`[DB] Connecting to: ${dbUrlForLog}`);

// Enable SSL in production (required by Render PostgreSQL and most cloud providers)
const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(isProduction && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

export const db = drizzle(pool, { schema });
