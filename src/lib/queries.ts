
import { getDb } from './db';
import type { User, Employee, Supervisor, Ticket, Project, JobCode, TicketAttachment, AddEmployeeFormData, AddSupervisorFormData, NewTicketFormData } from '@/types';
import { format } from 'date-fns';

// Helper to parse supervisor JSON fields
function parseSupervisor(sup: any): Supervisor | null {
    if (!sup) return null;
    return {
        ...sup,
        projectsHandledIds: sup.projectsHandledIds ? JSON.parse(sup.projectsHandledIds) : [],
        cityAccess: sup.cityAccess ? JSON.parse(sup.cityAccess) : [],
    };
}

// === USER QUERIES ===

export async function getUserByPsn(psn: number): Promise<User | null> {
    const db = await getDb();
    // Check supervisors table first, as they are a more specific role
    const supervisor = await db.get('SELECT * FROM supervisors WHERE psn = ?', psn);
    if (supervisor) return parseSupervisor(supervisor);
    
    // Fallback to employees table
    const employee = await db.get('SELECT * FROM employees WHERE psn = ?', psn);
    return employee || null;
}

export async function getAllUsers(): Promise<User[]> {
    const db = await getDb();
    const employees = await db.all('SELECT * FROM employees');
    const supervisorsRaw = await db.all('SELECT * FROM supervisors');
    const supervisors = supervisorsRaw.map(s => parseSupervisor(s) as Supervisor);
    return [...employees, ...supervisors];
}

export async function getEmployeeByPsn(psn: number): Promise<Employee | null> {
    const db = await getDb();
    return await db.get('SELECT * FROM employees WHERE psn = ?', psn);
}

export async function getSupervisorByPsn(psn: number): Promise<Supervisor | null> {
    const db = await getDb();
    const sup = await db.get('SELECT * FROM supervisors WHERE psn = ?', psn);
    return parseSupervisor(sup);
}

export async function getAllSupervisors(): Promise<Supervisor[]> {
    const db = await getDb();
    const supervisorsRaw = await db.all('SELECT * FROM supervisors');
    return supervisorsRaw.map(s => parseSupervisor(s) as Supervisor);
}

export async function getAllEmployees(): Promise<Employee[]> {
    const db = await getDb();
    return await db.all('SELECT * FROM employees');
}


// === TICKET QUERIES ===

export async function getTicketById(id: string): Promise<Ticket | null> {
    const db = await getDb();
    const ticket = await db.get('SELECT * FROM tickets WHERE id = ?', id);
    if (ticket) {
        const attachments = await db.all('SELECT * FROM ticket_attachments WHERE ticket_id = ?', id);
        ticket.attachments = attachments;
    }
    return ticket;
}

export async function getTicketsByEmployeePsn(psn: number): Promise<Ticket[]> {
    const db = await getDb();
    return await db.all('SELECT * FROM tickets WHERE psn = ? ORDER BY dateOfQuery DESC', psn);
}

export async function getAllTickets(): Promise<Ticket[]> {
    const db = await getDb();
    return await db.all('SELECT * FROM tickets ORDER BY dateOfQuery DESC');
}

// === PROJECT & JOB CODE QUERIES ===

export async function getAllProjects(): Promise<Project[]> {
    const db = await getDb();
    return await db.all('SELECT * FROM projects');
}

export async function getProjectById(id: string): Promise<Project | null> {
    const db = await getDb();
    return await db.get('SELECT * FROM projects WHERE id = ?', id);
}

export async function getAllJobCodes(): Promise<JobCode[]> {
    const db = await getDb();
    return await db.all('SELECT * FROM job_codes');
}

export async function getJobCodeById(id: string): Promise<JobCode | null> {
    const db = await getDb();
    return await db.get('SELECT * FROM job_codes WHERE id = ?', id);
}

export async function getAllGrades(): Promise<string[]> {
    const db = await getDb();
    const grades = await db.all<{grade: string}[]>('SELECT DISTINCT grade FROM employees ORDER BY grade');
    return grades.map(g => g.grade);
}

// === DATA MUTATION QUERIES ===

export async function addEmployee(data: AddEmployeeFormData) {
    const db = await getDb();
    const isName = data.isPSN ? (await getUserByPsn(Number(data.isPSN)))?.name : undefined;
    const nsName = data.nsPSN ? (await getUserByPsn(Number(data.nsPSN)))?.name : undefined;
    const dhName = data.dhPSN ? (await getUserByPsn(Number(data.dhPSN)))?.name : undefined;

    const result = await db.run(
      'INSERT INTO employees (psn, name, role, grade, jobCodeId, project, businessEmail, dateOfBirth, isPSN, isName, nsPSN, nsName, dhPSN, dhName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      Number(data.psn), data.name, 'Employee', data.grade, data.jobCodeId, data.project, data.businessEmail, data.dateOfBirth ? format(data.dateOfBirth, "yyyy-MM-dd") : undefined, data.isPSN ? Number(data.isPSN) : undefined, isName, data.nsPSN ? Number(data.nsPSN) : undefined, nsName, data.dhPSN ? Number(data.dhPSN) : undefined, dhName
    );
    return result;
}

export async function addSupervisor(data: AddSupervisorFormData) {
    const db = await getDb();
    const result = await db.run(
        'INSERT INTO supervisors (psn, name, role, functionalRole, title, businessEmail, dateOfBirth, branchProject, projectsHandledIds, cityAccess, ticketsResolved, ticketsPending) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        Number(data.psn), data.name, data.functionalRole, data.functionalRole, data.title, data.businessEmail, data.dateOfBirth ? format(data.dateOfBirth, "yyyy-MM-dd") : undefined, data.branchProject === "NO_PROJECT_SELECTED" ? undefined : data.branchProject, JSON.stringify(data.projectsHandledIds || []), JSON.stringify(data.cityAccess || []), 0, 0
    );
    return result;
}

export async function createTicket(ticketData: Omit<Ticket, 'id'>, attachments: File[] = []) {
    const db = await getDb();
    
    // A more robust unique ID for mock purposes
    const ticketId = `TKT${Date.now()}${Math.random().toString(36).substring(2, 6)}`;

    await db.run(
        'INSERT INTO tickets (id, psn, employeeName, query, followUpQuery, priority, dateOfQuery, actionPerformed, dateOfResponse, status, currentAssigneePSN, project, lastStatusUpdateDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ticketId, ticketData.psn, ticketData.employeeName, ticketData.query, ticketData.followUpQuery, ticketData.priority, ticketData.dateOfQuery, ticketData.actionPerformed, ticketData.dateOfResponse, ticketData.status, ticketData.currentAssigneePSN, ticketData.project, ticketData.lastStatusUpdateDate
    );

    for (const file of attachments) {
        const attachmentId = `${ticketId}-att-${Date.now()}-${Math.random()}`;
        const fileType = file.type.startsWith('image/') ? 'image' : 'document';
        // In a real app, you'd upload the file and store a URL. Here we simulate path.
        const urlOrContent = `uploads/${ticketId}/${file.name}`; 
        await db.run(
            'INSERT INTO ticket_attachments (id, ticket_id, fileName, fileType, urlOrContent, uploadedAt) VALUES (?, ?, ?, ?, ?, ?)',
            attachmentId, ticketId, file.name, fileType, urlOrContent, new Date().toISOString()
        );
    }
    
    return ticketId;
}

export async function updateTicket(ticketId: string, data: Partial<Ticket>) {
    const db = await getDb();
    const fields = Object.keys(data).filter(k => k !== 'id' && k !== 'attachments');
    const values = fields.map(k => (data as any)[k]);
    
    if (fields.length === 0) return;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    await db.run(
        `UPDATE tickets SET ${setClause} WHERE id = ?`,
        ...values,
        ticketId
    );
}

export async function addTicketAttachments(ticketId: string, attachments: File[]) {
    const db = await getDb();
    for (const file of attachments) {
        const attachmentId = `${ticketId}-att-${Date.now()}-${Math.random()}`;
        const fileType = file.type.startsWith('image/') ? 'image' : 'document';
        const urlOrContent = `uploads/${ticketId}/${file.name}`; // Simulated
        await db.run(
            'INSERT INTO ticket_attachments (id, ticket_id, fileName, fileType, urlOrContent, uploadedAt) VALUES (?, ?, ?, ?, ?, ?)',
            attachmentId, ticketId, file.name, fileType, urlOrContent, new Date().toISOString()
        );
    }
}
