
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
