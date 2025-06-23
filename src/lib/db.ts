
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

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
 * By creating a fresh connection each time, we guarantee that the application
 * always interacts with the most current state of the `db.sqlite` file, which
 * permanently resolves the persistent "DB not Ready" issue after seeding.
 */
export async function getDb(): Promise<Database> {
  try {
    const verbose_sqlite = sqlite3.verbose();
    const db = await open({
      filename: './db.sqlite',
      driver: verbose_sqlite.Database,
    });
    return db;
  } catch (error: any) {
    console.error("Failed to open database:", error);
    throw new Error("Could not open database connection.");
  }
}
