
'use server';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase';
import {
  getUserByPsn as getUserByPsnQuery,
  getAllEmployees as getAllEmployeesQuery,
  getAllSupervisors as getAllSupervisorsQuery,
  getAllProjects as getAllProjectsQuery,
  getAllJobCodes as getAllJobCodesQuery,
  getAllGrades as getAllGradesQuery,
  addEmployee as addEmployeeQuery,
  addSupervisor as addSupervisorQuery,
  createTicket as createTicketQuery,
  getSupervisorByPsn as getSupervisorByPsnQuery,
  getUserByEmail as getUserByEmailQuery,
  getTicketById as getTicketByIdQuery,
  getTicketsByEmployeePsn as getTicketsByEmployeePsnQuery,
  getAllTickets as getAllTicketsQuery,
  getProjectById as getProjectByIdQuery,
  getJobCodeById as getJobCodeByIdQuery,
  getEmployeeByPsn as getEmployeeByPsnQuery,
} from '@/lib/queries';
import type { User, Employee, Supervisor, AddEmployeeFormData, AddSupervisorFormData, Ticket, TicketAttachment, NewTicketFormData, TicketStatus } from '@/types';
import { revalidatePath } from 'next/cache';

function formatFirebaseError(error: any): string {
    const FIREBASE_CONNECTION_ERROR_MSG = "The app could not connect to Firestore. This is usually a configuration issue. Please check: 1) Your .env.local file has the correct Firebase project details. 2) Firestore database is created and enabled in your Firebase project console. 3) Your Firestore security rules allow reads from the application.";
    const GENERIC_ERROR_MSG = "An unexpected database error occurred. Please try again later.";

    if (error && typeof error.message === 'string') {
        const message = error.message.toLowerCase();
        if (message.includes('offline') || message.includes('failed to connect') || message.includes('network request failed')) {
            return FIREBASE_CONNECTION_ERROR_MSG;
        }
        if (message.includes('permission-denied') || message.includes('missing or insufficient permissions')) {
            return "Permission Denied. The database security rules are preventing access. Please check your Firestore rules.";
        }
        return error.message; 
    }
    return GENERIC_ERROR_MSG;
}

// Action to check if a PSN exists
export async function checkPSNExistsAction(psn: number): Promise<{ exists: boolean; error?: string }> {
  try {
    const user = await getUserByPsnQuery(psn);
    if (!user) {
        return { exists: false, error: "This PSN is not found in the database. Please contact an administrator or run the db:seed script." };
    }
    return { exists: true };
  } catch (error: any) {
    console.error("[Action Error] checkPSNExistsAction:", error.message);
    return { exists: false, error: formatFirebaseError(error) };
  }
}

// Action to get user from DB based on email (for onAuthStateChanged)
export async function getUserByEmailAction(email: string): Promise<{user: User | null, error?: string}> {
    try {
        const user = await getUserByEmailQuery(email);
        return { user };
    } catch (error: any) {
        console.error("[Action Error] getUserByEmailAction:", error.message);
        return { user: null, error: formatFirebaseError(error) }; 
    }
}

// Action for forgot password page
export async function getUserForPasswordResetAction(psn: number): Promise<{ businessEmail: string | undefined } | null> {
  try {
    const user = await getUserByPsnQuery(psn);
    if (user) {
      return { businessEmail: user.businessEmail };
    }
    return null;
  } catch (error: any) {
    console.error("[Action Error] getUserForPasswordResetAction:", error.message);
    return null;
  }
}


// --- Form and Data Loading Actions ---

export async function getAllProjectsAction() {
    return await getAllProjectsQuery();
}

export async function getAllJobCodesAction() {
    return await getAllJobCodesQuery();
}

export async function getAllGradesAction() {
    return await getAllGradesQuery();
}

export async function addEmployeeAction(data: AddEmployeeFormData) {
    await addEmployeeQuery(data);
    revalidatePath('/dashboard'); 
    revalidatePath('/supervisor/employee-details');
}

export async function addSupervisorAction(data: AddSupervisorFormData) {
    await addSupervisorQuery(data);
    revalidatePath('/dashboard');
}

export async function createTicketAction(formData: NewTicketFormData, creator: User) {
    let assigneePsn: number | undefined;

    const project = 'project' in creator ? (creator as Employee).project : ('branchProject' in creator ? (creator as Supervisor).branchProject : undefined);

    if (creator.role === 'Employee') {
        assigneePsn = (creator as Employee).isPSN;
    } else { // It's a supervisor
        const supervisorCreator = creator as Supervisor;
        switch (supervisorCreator.functionalRole) {
            case 'IS':
                assigneePsn = supervisorCreator.nsPSN;
                break;
            case 'NS':
                assigneePsn = supervisorCreator.dhPSN;
                break;
            case 'DH':
                const icHead = (await getAllSupervisorsQuery()).find(s => s.functionalRole === 'IC Head');
                assigneePsn = icHead?.psn;
                break;
            case 'IC Head':
                assigneePsn = supervisorCreator.psn;
                break;
        }
    }

    if (!assigneePsn) {
        if (creator.role === 'IC Head') {
            assigneePsn = creator.psn;
        } else {
            const icHead = (await getAllSupervisorsQuery()).find(s => s.functionalRole === 'IC Head');
            if (icHead) {
                 assigneePsn = icHead.psn;
                 console.warn(`Could not determine assignee for ticket by ${creator.name}. Assigning to IC Head as fallback.`);
            } else {
                 assigneePsn = creator.psn;
                 console.warn(`Could not determine assignee for ticket by ${creator.name} (${creator.psn}). Assigning to self as final fallback.`);
            }
        }
    }

    const newTicketData: Omit<Ticket, 'id' | 'attachments'> = {
      psn: creator.psn,
      employeeName: creator.name,
      query: formData.query,
      followUpQuery: formData.hasFollowUp ? formData.followUpQuery : undefined,
      priority: formData.priority,
      dateOfQuery: new Date().toISOString(),
      status: 'Open' as TicketStatus,
      project: project || 'N/A',
      currentAssigneePSN: assigneePsn,
      lastStatusUpdateDate: new Date().toISOString(),
    };
    
    const newTicketId = await createTicketQuery(newTicketData);
    let supervisorName: string | null = null;
    
    if (assigneePsn) {
        const supervisor = await getSupervisorByPsnQuery(assigneePsn);
        if (supervisor) {
            supervisorName = supervisor.name;
        }
    }

    revalidatePath('/dashboard');
    revalidatePath('/employee/tickets');
    revalidatePath(`/tickets/${newTicketId}`);
    return { ticketId: newTicketId, supervisorName };
}

export async function updateTicketAction(ticketId: string, data: Partial<Ticket>, attachments?: File[]) {
    const { updateTicket, addTicketAttachments } = require('@/lib/queries');
    
    await updateTicket(ticketId, data);
    
    if (attachments && attachments.length > 0) {
        await addTicketAttachments(ticketId, attachments);
    }

    revalidatePath(`/tickets/${ticketId}`);
    revalidatePath('/dashboard');
    revalidatePath('/hr/tickets');
    revalidatePath('/employee/tickets');
}


// --- Data Fetching Actions for UI ---

export async function getTicketByIdAction(id: string) {
    return await getTicketByIdQuery(id);
}

export async function getTicketsByEmployeePsnAction(psn: number) {
    return await getTicketsByEmployeePsnQuery(psn);
}

export async function getAllTicketsAction() {
    return await getAllTicketsQuery();
}

export async function getAllEmployeesAction() {
    return await getAllEmployeesQuery();
}

export async function getAllSupervisorsAction() {
    return await getAllSupervisorsQuery();
}

export async function getProjectByIdAction(id: string) {
    return await getProjectByIdQuery(id);
}

export async function getJobCodeByIdAction(id: string) {
    return await getJobCodeByIdQuery(id);
}

export async function getSupervisorByPsnAction(psn: number) {
    return await getSupervisorByPsnQuery(psn);
}

export async function getEmployeeByPsn(psn: number) {
    return await getEmployeeByPsnQuery(psn);
}
