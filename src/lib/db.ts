
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

// Note: In a production environment, you would typically use a singleton pattern 
// to manage a single database connection. For the development environment, 
// re-opening the connection on each call to getDb() is a simple and effective 
// way to ensure the application always picks up changes made by external scripts,
// such as the database seeder.

export async function getDb() {
  // Use verbose mode for more detailed logs during development.
  const verbose_sqlite = sqlite3.verbose();
  const db = await open({
    filename: './db.sqlite', // The file path for the database.
    driver: verbose_sqlite.Database
  });
  return db;
}
