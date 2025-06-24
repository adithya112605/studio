
'use server';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase';
import {
  getUserByPsn,
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
} from '@/lib/queries';
import type { User, AddEmployeeFormData, AddSupervisorFormData, Ticket, TicketAttachment } from '@/types';
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
    const user = await getUserByPsn(psn);
    if (!user) {
        return { exists: false, error: "This PSN is not found in the database. Please contact an administrator or run the db:seed script." };
    }
    return { exists: true };
  } catch (error: any) {
    console.error("[Action Error] checkPSNExistsAction:", error.message);
    return { exists: false, error: formatFirebaseError(error) };
  }
}

// Action for user login
export async function loginAction(psn: number, password?: string): Promise<{ success: boolean; message: string }> {
  const auth = getAuthInstance();
  if (!auth) {
    return { success: false, message: "Authentication service is unavailable." };
  }
  let lntUser;
  try {
    lntUser = await getUserByPsn(psn);
  } catch (error: any) {
    console.error("[Action Error] loginAction fetching user:", error.message);
    return { success: false, message: formatFirebaseError(error) };
  }

  if (!lntUser || !lntUser.businessEmail) {
    return { success: false, message: "PSN not found or no business email is associated with it." };
  }
  if (!password) {
    return { success: false, message: "Password is required." };
  }

  try {
    await signInWithEmailAndPassword(auth, lntUser.businessEmail, password);
    return { success: true, message: "Login successful." };
  } catch (error: any) {
    let errorMessage = "An unknown error occurred.";
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = "Invalid PSN or password.";
          break;
        case 'auth/invalid-email':
          errorMessage = "The business email for this PSN is invalid.";
          break;
        case 'auth/configuration-not-found':
          errorMessage = "Firebase Authentication is not configured. Please enable Email/Password provider in your Firebase Console.";
          break;
        default:
          errorMessage = error.message;
      }
    }
    return { success: false, message: errorMessage };
  }
}

// Action for user signup
export async function signupAction(psn: number, password?: string): Promise<{ success: boolean; message: string }> {
  const auth = getAuthInstance();
  if (!auth) {
    return { success: false, message: "Authentication service is unavailable." };
  }

  let lntUser;
  try {
    lntUser = await getUserByPsn(psn);
  } catch (error: any) {
    console.error("[Action Error] signupAction fetching user:", error.message);
    return { success: false, message: formatFirebaseError(error) };
  }

  if (!lntUser || !lntUser.businessEmail) {
    return { success: false, message: "PSN not found or no business email is associated with it." };
  }
  if (!password) {
    return { success: false, message: "Password is required." };
  }

  try {
    await createUserWithEmailAndPassword(auth, lntUser.businessEmail, password);
    return { success: true, message: "Account created successfully! You are now logged in."};
  } catch (error: any)
  {
    let errorMessage = "An unknown error occurred during signup.";
    if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "This account has already been registered. Please sign in.";
            break;
          case 'auth/weak-password':
            errorMessage = "The password is too weak.";
            break;
          case 'auth/invalid-email':
            errorMessage = "The business email for this PSN is invalid.";
            break;
          case 'auth/configuration-not-found':
            errorMessage = "Firebase Authentication is not configured. Please enable Email/Password provider in your Firebase Console.";
            break;
          default:
            errorMessage = error.message;
        }
    }
    return { success: false, message: errorMessage };
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
    const user = await getUserByPsn(psn);
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

export async function createTicketAction(ticketData: Omit<Ticket, 'id' | 'attachments'>) {
    const newTicketId = await createTicketQuery(ticketData);
    let supervisorName: string | null = null;
    
    if (ticketData.currentAssigneePSN) {
        const supervisor = await getSupervisorByPsnQuery(ticketData.currentAssigneePSN);
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
