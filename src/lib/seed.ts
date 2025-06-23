
import { getDb } from './db';
import { mockEmployees, mockSupervisors, mockTickets, mockProjects, mockJobCodes } from '@/data/mockData';
import fs from 'fs';
import path from 'path';

async function seedDatabase() {
  const dbPath = path.resolve('./db.sqlite');

  // Delete the existing database file to ensure a clean slate and break any stale connections.
  if (fs.existsSync(dbPath)) {
      try {
        // First, ensure any existing connection is closed if the DB object is a singleton.
        // For our `getDb` which opens fresh, this is less critical but good practice.
        // Then, delete the file.
        fs.unlinkSync(dbPath);
        console.log("Successfully deleted existing database file to ensure a fresh start.");
      } catch (err) {
        console.error("Error deleting existing database file:", err);
        // If we can't delete it, we should stop to avoid unpredictable behavior.
        return;
      }
  }

  const db = await getDb();
  console.log("Starting database seeding process...");

  // Create tables
  await db.exec(`
    CREATE TABLE projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL
    );

    CREATE TABLE job_codes (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE employees (
      psn INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      grade TEXT NOT NULL,
      jobCodeId TEXT,
      project TEXT,
      businessEmail TEXT,
      dateOfBirth TEXT,
      isPSN INTEGER,
      isName TEXT,
      nsPSN INTEGER,
      nsName TEXT,
      dhPSN INTEGER,
      dhName TEXT
    );

    CREATE TABLE supervisors (
      psn INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      functionalRole TEXT NOT NULL,
      title TEXT NOT NULL,
      businessEmail TEXT,
      dateOfBirth TEXT,
      branchProject TEXT,
      projectsHandledIds TEXT, -- Stored as JSON string
      cityAccess TEXT, -- Stored as JSON string
      ticketsResolved INTEGER,
      ticketsPending INTEGER
    );

    CREATE TABLE tickets (
      id TEXT PRIMARY KEY,
      psn INTEGER NOT NULL,
      employeeName TEXT NOT NULL,
      query TEXT NOT NULL,
      followUpQuery TEXT,
      priority TEXT NOT NULL,
      dateOfQuery TEXT NOT NULL,
      actionPerformed TEXT,
      dateOfResponse TEXT,
      status TEXT NOT NULL,
      currentAssigneePSN INTEGER,
      project TEXT NOT NULL,
      lastStatusUpdateDate TEXT NOT NULL
    );

    CREATE TABLE ticket_attachments (
        id TEXT PRIMARY KEY,
        ticket_id TEXT NOT NULL,
        fileName TEXT NOT NULL,
        fileType TEXT NOT NULL,
        urlOrContent TEXT NOT NULL,
        uploadedAt TEXT NOT NULL,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id)
    );
  `);
  console.log("Created new tables.");

  // Seed Projects
  for (const project of mockProjects) {
    await db.run('INSERT INTO projects (id, name, city) VALUES (?, ?, ?)', project.id, project.name, project.city);
  }
  console.log(`Seeded ${mockProjects.length} projects.`);

  // Seed Job Codes
  for (const jobCode of mockJobCodes) {
    await db.run('INSERT INTO job_codes (id, code, description) VALUES (?, ?, ?)', jobCode.id, jobCode.code, jobCode.description);
  }
  console.log(`Seeded ${mockJobCodes.length} job codes.`);

  // Seed Employees
  for (const emp of mockEmployees) {
    await db.run(
      'INSERT INTO employees (psn, name, role, grade, jobCodeId, project, businessEmail, dateOfBirth, isPSN, isName, nsPSN, nsName, dhPSN, dhName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      emp.psn, emp.name, emp.role, emp.grade, emp.jobCodeId, emp.project, emp.businessEmail, emp.dateOfBirth, emp.isPSN, emp.isName, emp.nsPSN, emp.nsName, emp.dhPSN, emp.dhName
    );
  }
  console.log(`Seeded ${mockEmployees.length} employees.`);

  // Seed Supervisors
  for (const sup of mockSupervisors) {
    await db.run(
      'INSERT INTO supervisors (psn, name, role, functionalRole, title, businessEmail, dateOfBirth, branchProject, projectsHandledIds, cityAccess, ticketsResolved, ticketsPending) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      sup.psn, sup.name, sup.role, sup.functionalRole, sup.title, sup.businessEmail, sup.dateOfBirth, sup.branchProject, JSON.stringify(sup.projectsHandledIds || []), JSON.stringify(sup.cityAccess || []), sup.ticketsResolved, sup.ticketsPending
    );
  }
  console.log(`Seeded ${mockSupervisors.length} supervisors.`);

  // Seed Tickets and Attachments
  for (const ticket of mockTickets) {
    await db.run(
      'INSERT INTO tickets (id, psn, employeeName, query, followUpQuery, priority, dateOfQuery, actionPerformed, dateOfResponse, status, currentAssigneePSN, project, lastStatusUpdateDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ticket.id, ticket.psn, ticket.employeeName, ticket.query, ticket.followUpQuery, ticket.priority, ticket.dateOfQuery, ticket.actionPerformed, ticket.dateOfResponse, ticket.status, ticket.currentAssigneePSN, ticket.project, ticket.lastStatusUpdateDate
    );
    if (ticket.attachments) {
      for (const attachment of ticket.attachments) {
        await db.run(
          'INSERT INTO ticket_attachments (id, ticket_id, fileName, fileType, urlOrContent, uploadedAt) VALUES (?, ?, ?, ?, ?, ?)',
          attachment.id, ticket.id, attachment.fileName, attachment.fileType, attachment.urlOrContent, attachment.uploadedAt
        );
      }
    }
  }
  console.log(`Seeded ${mockTickets.length} tickets and their attachments.`);

  await db.close();
  console.log("Database connection closed.");

  console.log("Database seeding completed successfully!");
}

if (require.main === module) {
  seedDatabase().catch(err => {
    console.error("Error seeding database:", err);
  });
}
