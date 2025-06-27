
import { getFirestoreInstance } from './firebase';
import type { User, Employee, Supervisor, Ticket, Project, JobCode, AddEmployeeFormData, AddSupervisorFormData, TicketAttachment } from '@/types';
import { collection, doc, getDoc, getDocs, setDoc, query, where, addDoc, writeBatch, updateDoc } from "firebase/firestore";
import { format } from 'date-fns';

function getDb() {
    const db = getFirestoreInstance();
    if (!db) {
        throw new Error("Firestore is not initialized. Please check that your Firebase project configuration is correctly set in the .env.local file and that you have restarted the development server.");
    }
    return db;
}

// === USER QUERIES ===

export async function getUserByPsn(psn: number): Promise<User | null> {
    const firestore = getDb();
    const psnString = psn.toString();
    
    const supervisorRef = doc(firestore, 'supervisors', psnString);
    const supervisorSnap = await getDoc(supervisorRef);
    if (supervisorSnap.exists()) {
        return supervisorSnap.data() as Supervisor;
    }
    
    const employeeRef = doc(firestore, 'employees', psnString);
    const employeeSnap = await getDoc(employeeRef);
    if (employeeSnap.exists()) {
        return employeeSnap.data() as Employee;
    }

    return null;
}


export async function getUserByEmail(email: string): Promise<User | null> {
    const firestore = getDb();
    const lcEmail = email.toLowerCase();
    
    const empQuery = query(collection(firestore, 'employees'), where("businessEmail", "==", lcEmail));
    const empSnap = await getDocs(empQuery);
    if (!empSnap.empty) {
        return empSnap.docs[0].data() as Employee;
    }

    const supQuery = query(collection(firestore, 'supervisors'), where("businessEmail", "==", lcEmail));
    const supSnap = await getDocs(supQuery);
    if (!supSnap.empty) {
        return supSnap.docs[0].data() as Supervisor;
    }
    
    return null;
}

export async function getAllUsers(): Promise<User[]> {
    const firestore = getDb();
    const employeesSnap = await getDocs(collection(firestore, 'employees'));
    const supervisorsSnap = await getDocs(collection(firestore, 'supervisors'));

    const employees = employeesSnap.docs.map(doc => doc.data() as Employee);
    const supervisors = supervisorsSnap.docs.map(doc => doc.data() as Supervisor);
    
    return [...employees, ...supervisors];
}

export async function getEmployeeByPsn(psn: number): Promise<Employee | null> {
    const firestore = getDb();
    const docRef = doc(firestore, 'employees', psn.toString());
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as Employee : null;
}

export async function getSupervisorByPsn(psn: number): Promise<Supervisor | null> {
    const firestore = getDb();
    const docRef = doc(firestore, 'supervisors', psn.toString());
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as Supervisor : null;
}

export async function getAllSupervisors(): Promise<Supervisor[]> {
    const firestore = getDb();
    const supervisorsSnap = await getDocs(collection(firestore, 'supervisors'));
    return supervisorsSnap.docs.map(doc => doc.data() as Supervisor);
}

export async function getAllEmployees(): Promise<Employee[]> {
    const firestore = getDb();
    const employeesSnap = await getDocs(collection(firestore, 'employees'));
    return employeesSnap.docs.map(doc => doc.data() as Employee);
}


// === TICKET QUERIES ===

export async function getTicketById(id: string): Promise<Ticket | null> {
    const firestore = getDb();
    const ticketRef = doc(firestore, 'tickets', id);
    const ticketSnap = await getDoc(ticketRef);

    if (ticketSnap.exists()) {
        const ticketData = ticketSnap.data() as Omit<Ticket, 'attachments'>;
        const attachmentsSnap = await getDocs(collection(firestore, `tickets/${id}/attachments`));
        const attachments = attachmentsSnap.docs.map(d => d.data() as TicketAttachment);
        return { ...ticketData, id: ticketSnap.id, attachments };
    }
    return null;
}

export async function getTicketsByEmployeePsn(psn: number): Promise<Ticket[]> {
    const firestore = getDb();
    const ticketsRef = collection(firestore, 'tickets');
    // NOTE: This query requires a composite index in Firestore on (psn, dateOfQuery).
    // The Firebase console will provide a link to create this index the first time the query fails.
    const q = query(ticketsRef, where("psn", "==", psn));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
}

export async function getAllTickets(): Promise<Ticket[]> {
    const firestore = getDb();
    const ticketsSnap = await getDocs(collection(firestore, 'tickets'));
    return ticketsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
}

// === PROJECT & JOB CODE QUERIES ===

export async function getAllProjects(): Promise<Project[]> {
    const firestore = getDb();
    const projectsSnap = await getDocs(collection(firestore, 'projects'));
    return projectsSnap.docs.map(doc => doc.data() as Project);
}

export async function getProjectById(id: string): Promise<Project | null> {
    const firestore = getDb();
    const docRef = doc(firestore, 'projects', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as Project : null;
}

export async function getAllJobCodes(): Promise<JobCode[]> {
    const firestore = getDb();
    const jobCodesSnap = await getDocs(collection(firestore, 'job_codes'));
    return jobCodesSnap.docs.map(doc => doc.data() as JobCode);
}

export async function getJobCodeById(id: string): Promise<JobCode | null> {
    const firestore = getDb();
    const docRef = doc(firestore, 'job_codes', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as JobCode : null;
}

export async function getAllGrades(): Promise<string[]> {
    // In Firestore, this kind of aggregation is best handled by a dedicated 'metadata' document
    // or by deriving from the client-side mock data for this app's purpose.
    const allEmployees = await getAllEmployees();
    const grades = new Set(allEmployees.map(e => e.grade));
    return Array.from(grades).sort();
}

// === DATA MUTATION QUERIES ===

export async function addEmployee(data: AddEmployeeFormData) {
    const firestore = getDb();
    const isName = data.isPSN ? (await getUserByPsn(Number(data.isPSN)))?.name : undefined;
    const nsName = data.nsPSN ? (await getUserByPsn(Number(data.nsPSN)))?.name : undefined;
    const dhName = data.dhPSN ? (await getUserByPsn(Number(data.dhPSN)))?.name : undefined;

    const newEmployee: Employee = {
        psn: Number(data.psn),
        name: data.name,
        role: 'Employee',
        grade: data.grade,
        jobCodeId: data.jobCodeId,
        project: data.project,
        businessEmail: data.businessEmail.toLowerCase(),
        dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, "yyyy-MM-dd") : undefined,
        isPSN: data.isPSN ? Number(data.isPSN) : undefined,
        isName: isName,
        nsPSN: data.nsPSN ? Number(data.nsPSN) : undefined,
        nsName: nsName,
        dhPSN: data.dhPSN ? Number(data.dhPSN) : undefined,
        dhName: dhName,
    };
    
    await setDoc(doc(firestore, 'employees', data.psn.toString()), newEmployee);
}

export async function addSupervisor(data: AddSupervisorFormData) {
    const firestore = getDb();
    
    const newSupervisor: Supervisor = {
        psn: Number(data.psn),
        name: data.name,
        role: data.functionalRole,
        functionalRole: data.functionalRole,
        title: data.title,
        businessEmail: data.businessEmail.toLowerCase(),
        dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, "yyyy-MM-dd") : undefined,
        branchProject: data.branchProject === "NO_PROJECT_SELECTED" ? undefined : data.branchProject,
        projectsHandledIds: data.projectsHandledIds || [],
        cityAccess: data.cityAccess || [],
        ticketsResolved: 0,
        ticketsPending: 0
    };

    await setDoc(doc(firestore, 'supervisors', data.psn.toString()), newSupervisor);
}

export async function createTicket(ticketData: Omit<Ticket, 'id' | 'attachments'>) {
    const firestore = getDb();
    const docRef = await addDoc(collection(firestore, 'tickets'), ticketData);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
}

export async function updateTicket(ticketId: string, data: Partial<Ticket>) {
    const firestore = getDb();
    if (Object.keys(data).length === 0) return;

    // We must remove attachments from the data object before sending to Firestore,
    // as it's a subcollection and not a field.
    const { attachments, ...updateData } = data;

    const ticketRef = doc(firestore, 'tickets', ticketId);
    await updateDoc(ticketRef, updateData);
}

export async function addTicketAttachments(ticketId: string, attachments: File[]) {
    const firestore = getDb();
    const batch = writeBatch(firestore);

    for (const file of attachments) {
        // NOTE: This does not actually upload the file, just its metadata.
        // File uploads require Firebase Storage, which is beyond this scope.
        const attachmentId = `${ticketId}-att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const fileType = file.type.startsWith('image/') ? 'image' : 'document';
        const urlOrContent = `uploads/${ticketId}/${file.name}`; // Simulated path
        const newAttachment: TicketAttachment = {
            id: attachmentId,
            fileName: file.name,
            fileType: fileType,
            urlOrContent: urlOrContent,
            uploadedAt: new Date().toISOString()
        };

        const attDocRef = doc(firestore, `tickets/${ticketId}/attachments`, attachmentId);
        batch.set(attDocRef, newAttachment);
    }
    await batch.commit();
}
