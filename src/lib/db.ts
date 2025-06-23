'use server';

import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

// This is a singleton to ensure we only have one database connection.
let db: Database | null = null;

export async function getDb() {
  if (!db) {
    // Use verbose mode for more detailed logs during development.
    const verbose_sqlite = sqlite3.verbose();
    db = await open({
      filename: './db.sqlite', // The file path for the database.
      driver: verbose_sqlite.Database
    });
  }
  return db;
}


/**
 * Invalidates and closes the current database connection.
 * This is useful in development if the database file is changed by an external process (e.g., seeding).
 */
export async function invalidateDb() {
    if (db) {
        await db.close();
        db = null;
    }
}
