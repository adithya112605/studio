
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';
import path from 'path';

/**
 * Establishes a connection to the SQLite database.
 *
 * IMPORTANT: This function intentionally creates a new database connection for every
 * call instead of using a singleton pattern. In a hot-reloading development
 * environment like Next.js, the server process can hold onto a cached or "stale"
 * connection to the database file. If an external script (like `npm run db:seed`)
 * modifies or replaces the database file, the running server might not see the
 * changes, leading to "table not found" errors.
 *
 * This function now uses an absolute path to the database file to prevent any
 * ambiguity caused by the server's current working directory. This guarantees
 * both the app and the seed script are interacting with the exact same file.
 */
export async function getDb(): Promise<Database> {
  try {
    const dbPath = path.join(process.cwd(), 'db.sqlite');
    const verbose_sqlite = sqlite3.verbose();
    const db = await open({
      filename: dbPath,
      driver: verbose_sqlite.Database,
    });
    return db;
  } catch (error: any) {
    console.error("Failed to open database:", error);
    throw new Error("Could not open database connection.");
  }
}
