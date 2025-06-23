import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

let dbInstance: Database | null = null;

// This function now uses a singleton pattern to manage the database connection.
// This is more efficient and prevents issues with multiple concurrent connections.
export async function getDb() {
  if (!dbInstance) {
    try {
      const verbose_sqlite = sqlite3.verbose();
      dbInstance = await open({
        filename: './db.sqlite',
        driver: verbose_sqlite.Database,
      });
    } catch (error: any) {
        console.error("Failed to open database:", error);
        // This will be caught by the server action and reported to the user.
        throw new Error("Could not open database connection.");
    }
  }
  return dbInstance;
}
