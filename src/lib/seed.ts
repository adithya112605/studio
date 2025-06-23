
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { mockEmployees, mockSupervisors, mockTickets, mockProjects, mockJobCodes } from '@/data/mockData';
import fs from 'fs';
import path from 'path';

async function seedDatabase() {
    const dbPath = path.resolve('./db.sqlite');

    // Forcefully delete the old database file to break any stale connections from the dev server.
    if (fs.existsSync(dbPath)) {
        try {
            fs.unlinkSync(dbPath);
            console.log("Successfully deleted existing database file to ensure a fresh start.");
        } catch (err) {
            console.error("Error deleting existing database file:", err);
            process.exit(1); // Exit if we can't delete the file, as it's a critical step
        }
    }

    let db;
    try {
        // Open the database connection using the promise-based wrapper
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log("Database file created successfully. Seeding data...");

        // Use transaction for performance
        await db.exec('BEGIN TRANSACTION;');

        await db.exec(`
            CREATE TABLE projects ( id TEXT PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL );
            CREATE TABLE job_codes ( id TEXT PRIMARY KEY, code TEXT NOT NULL, description TEXT NOT NULL );
            CREATE TABLE employees ( psn INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, grade TEXT NOT NULL, jobCodeId TEXT, project TEXT, businessEmail TEXT, dateOfBirth TEXT, isPSN INTEGER, isName TEXT, nsPSN INTEGER, nsName TEXT, dhPSN INTEGER, dhName TEXT );
            CREATE TABLE supervisors ( psn INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, functionalRole TEXT NOT NULL, title TEXT NOT NULL, businessEmail TEXT, dateOfBirth TEXT, branchProject TEXT, projectsHandledIds TEXT, cityAccess TEXT, ticketsResolved INTEGER, ticketsPending INTEGER );
            CREATE TABLE tickets ( id TEXT PRIMARY KEY, psn INTEGER NOT NULL, employeeName TEXT NOT NULL, query TEXT NOT NULL, followUpQuery TEXT, priority TEXT NOT NULL, dateOfQuery TEXT NOT NULL, actionPerformed TEXT, dateOfResponse TEXT, status TEXT NOT NULL, currentAssigneePSN INTEGER, project TEXT NOT NULL, lastStatusUpdateDate TEXT NOT NULL );
            CREATE TABLE ticket_attachments ( id TEXT PRIMARY KEY, ticket_id TEXT NOT NULL, fileName TEXT NOT NULL, fileType TEXT NOT NULL, urlOrContent TEXT NOT NULL, uploadedAt TEXT NOT NULL, FOREIGN KEY (ticket_id) REFERENCES tickets(id) );
        `);
        console.log("Tables created.");

        // Seed data using prepared statements for safety and performance
        for (const p of mockProjects) await db.run('INSERT INTO projects (id, name, city) VALUES (?, ?, ?)', p.id, p.name, p.city);
        console.log(`Seeded ${mockProjects.length} projects.`);

        for (const jc of mockJobCodes) await db.run('INSERT INTO job_codes (id, code, description) VALUES (?, ?, ?)', jc.id, jc.code, jc.description);
        console.log(`Seeded ${mockJobCodes.length} job codes.`);

        for (const emp of mockEmployees) await db.run('INSERT INTO employees (psn, name, role, grade, jobCodeId, project, businessEmail, dateOfBirth, isPSN, isName, nsPSN, nsName, dhPSN, dhName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', emp.psn, emp.name, emp.role, emp.grade, emp.jobCodeId, emp.project, emp.businessEmail, emp.dateOfBirth, emp.isPSN, emp.isName, emp.nsPSN, emp.nsName, emp.dhPSN, emp.dhName);
        console.log(`Seeded ${mockEmployees.length} employees.`);

        for (const sup of mockSupervisors) await db.run('INSERT INTO supervisors (psn, name, role, functionalRole, title, businessEmail, dateOfBirth, branchProject, projectsHandledIds, cityAccess, ticketsResolved, ticketsPending) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', sup.psn, sup.name, sup.role, sup.functionalRole, sup.title, sup.businessEmail, sup.dateOfBirth, sup.branchProject, JSON.stringify(sup.projectsHandledIds || []), JSON.stringify(sup.cityAccess || []), sup.ticketsResolved, sup.ticketsPending);
        console.log(`Seeded ${mockSupervisors.length} supervisors.`);

        for (const ticket of mockTickets) {
            await db.run('INSERT INTO tickets (id, psn, employeeName, query, followUpQuery, priority, dateOfQuery, actionPerformed, dateOfResponse, status, currentAssigneePSN, project, lastStatusUpdateDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ticket.id, ticket.psn, ticket.employeeName, ticket.query, ticket.followUpQuery, ticket.priority, ticket.dateOfQuery, ticket.actionPerformed, ticket.dateOfResponse, ticket.status, ticket.currentAssigneePSN, ticket.project, ticket.lastStatusUpdateDate);
            if (ticket.attachments) {
                for (const attachment of ticket.attachments) {
                    await db.run('INSERT INTO ticket_attachments (id, ticket_id, fileName, fileType, urlOrContent, uploadedAt) VALUES (?, ?, ?, ?, ?, ?)', attachment.id, ticket.id, attachment.fileName, attachment.fileType, attachment.urlOrContent, attachment.uploadedAt);
                }
            }
        }
        console.log(`Seeded ${mockTickets.length} tickets.`);

        await db.exec('COMMIT;');
        console.log("Database seeding completed successfully.");

    } catch (seedError: any) {
        console.error("A critical error occurred during the seeding process:", seedError.message);
        if (db) {
            await db.exec('ROLLBACK;');
        }
    } finally {
        if (db) {
            await db.close();
            console.log("Database connection closed.");
        }
    }
}

// Ensure the script runs only when executed directly from the command line
if (require.main === module) {
    seedDatabase();
}
