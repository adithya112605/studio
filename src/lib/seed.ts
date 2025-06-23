
import { open, type Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { mockEmployees, mockSupervisors, mockTickets, mockProjects, mockJobCodes } from '@/data/mockData';
import fs from 'fs';
import path from 'path';

// This function will be called directly from the command line
async function seedDatabase() {
  const dbPath = path.resolve('./db.sqlite');

  // Step 1: Forcefully delete the old database file. This is crucial to break
  // any stale connections held by the hot-reloading dev server.
  if (fs.existsSync(dbPath)) {
    try {
      fs.unlinkSync(dbPath);
      console.log("✅ Successfully deleted existing database file.");
    } catch (err) {
      console.error("❌ Error deleting existing database file:", err);
      // Exit with an error code because if this fails, seeding cannot succeed.
      process.exit(1);
    }
  }

  let db: Database | null = null;
  try {
    // Step 2: Open a brand new database connection.
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    console.log("✅ New database file created. Creating schema...");

    // Step 3: Create the database schema.
    await db.exec(`
        CREATE TABLE projects ( id TEXT PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL );
        CREATE TABLE job_codes ( id TEXT PRIMARY KEY, code TEXT NOT NULL, description TEXT NOT NULL );
        CREATE TABLE employees ( psn INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, grade TEXT NOT NULL, jobCodeId TEXT, project TEXT, businessEmail TEXT, dateOfBirth TEXT, isPSN INTEGER, isName TEXT, nsPSN INTEGER, nsName TEXT, dhPSN INTEGER, dhName TEXT );
        CREATE TABLE supervisors ( psn INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, functionalRole TEXT NOT NULL, title TEXT NOT NULL, businessEmail TEXT, dateOfBirth TEXT, branchProject TEXT, projectsHandledIds TEXT, cityAccess TEXT, ticketsResolved INTEGER, ticketsPending INTEGER );
        CREATE TABLE tickets ( id TEXT PRIMARY KEY, psn INTEGER NOT NULL, employeeName TEXT NOT NULL, query TEXT NOT NULL, followUpQuery TEXT, priority TEXT NOT NULL, dateOfQuery TEXT NOT NULL, actionPerformed TEXT, dateOfResponse TEXT, status TEXT NOT NULL, currentAssigneePSN INTEGER, project TEXT NOT NULL, lastStatusUpdateDate TEXT NOT NULL );
        CREATE TABLE ticket_attachments ( id TEXT PRIMARY KEY, ticket_id TEXT NOT NULL, fileName TEXT NOT NULL, fileType TEXT NOT NULL, urlOrContent TEXT NOT NULL, uploadedAt TEXT NOT NULL, FOREIGN KEY (ticket_id) REFERENCES tickets(id) );
    `);
    console.log("✅ Tables created. Seeding data...");

    // Step 4: Seed all the data within a single transaction for performance.
    await db.exec('BEGIN TRANSACTION;');
    
    for (const p of mockProjects) await db.run('INSERT INTO projects (id, name, city) VALUES (?, ?, ?)', p.id, p.name, p.city);
    for (const jc of mockJobCodes) await db.run('INSERT INTO job_codes (id, code, description) VALUES (?, ?, ?)', jc.id, jc.code, jc.description);
    for (const emp of mockEmployees) await db.run('INSERT INTO employees (psn, name, role, grade, jobCodeId, project, businessEmail, dateOfBirth, isPSN, isName, nsPSN, nsName, dhPSN, dhName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', emp.psn, emp.name, emp.role, emp.grade, emp.jobCodeId, emp.project, emp.businessEmail, emp.dateOfBirth, emp.isPSN, emp.isName, emp.nsPSN, emp.nsName, emp.dhPSN, emp.dhName);
    for (const sup of mockSupervisors) await db.run('INSERT INTO supervisors (psn, name, role, functionalRole, title, businessEmail, dateOfBirth, branchProject, projectsHandledIds, cityAccess, ticketsResolved, ticketsPending) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', sup.psn, sup.name, sup.role, sup.functionalRole, sup.title, sup.businessEmail, sup.dateOfBirth, sup.branchProject, JSON.stringify(sup.projectsHandledIds || []), JSON.stringify(sup.cityAccess || []), sup.ticketsResolved, sup.ticketsPending);

    for (const ticket of mockTickets) {
        await db.run('INSERT INTO tickets (id, psn, employeeName, query, followUpQuery, priority, dateOfQuery, actionPerformed, dateOfResponse, status, currentAssigneePSN, project, lastStatusUpdateDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ticket.id, ticket.psn, ticket.employeeName, ticket.query, ticket.followUpQuery, ticket.priority, ticket.dateOfQuery, ticket.actionPerformed, ticket.dateOfResponse, ticket.status, ticket.currentAssigneePSN, ticket.project, ticket.lastStatusUpdateDate);
        if (ticket.attachments) {
            for (const attachment of ticket.attachments) {
                await db.run('INSERT INTO ticket_attachments (id, ticket_id, fileName, fileType, urlOrContent, uploadedAt) VALUES (?, ?, ?, ?, ?, ?)', attachment.id, ticket.id, attachment.fileName, attachment.fileType, attachment.urlOrContent, attachment.uploadedAt);
            }
        }
    }
    
    await db.exec('COMMIT;');
    console.log(`✅ Seeding complete. ${mockProjects.length} projects, ${mockJobCodes.length} job codes, ${mockEmployees.length} employees, ${mockSupervisors.length} supervisors, and ${mockTickets.length} tickets inserted.`);

  } catch (err: any) {
    console.error("❌ A critical error occurred during the seeding process:", err.message);
    if (db) {
      await db.exec('ROLLBACK;').catch(rbErr => console.error("Rollback failed:", rbErr));
    }
  } finally {
    // Step 5: Gracefully close the connection to ensure all data is flushed to the file.
    if (db) {
      await db.close();
      console.log("✅ Database connection closed by seed script.");
    }
  }
}

// Execute the function
seedDatabase().catch(err => {
    console.error("Seeding script failed to execute:", err);
    process.exit(1);
});
