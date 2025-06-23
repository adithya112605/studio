
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

// By removing the singleton instance, we ensure that every action gets a fresh
// connection to the database file. In a development environment with SQLite,
// this is more robust and prevents issues where a cached connection might point
// to a non-existent or un-seeded database, which was the root cause of the
// persistent "DB not Ready" error.
export async function getDb(): Promise<Database> {
  try {
    const verbose_sqlite = sqlite3.verbose();
    // Always open a new connection to ensure the latest state of the db file is read.
    const db = await open({
      filename: './db.sqlite',
      driver: verbose_sqlite.Database,
    });
    return db;
  } catch (error: any) {
    console.error("Failed to open database:", error);
    // This will be caught by the server action and reported to the user.
    throw new Error("Could not open database connection.");
  }
}
