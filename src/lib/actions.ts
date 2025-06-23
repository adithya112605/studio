
'use server';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';
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

// Action to check if a PSN exists
export async function checkPSNExistsAction(psn: number): Promise<boolean> {
  try {
    const user = await getUserByPsn(psn);
    return !!user;
  } catch (error: any) {
    console.error("[Action Error] checkPSNExistsAction:", error.message);
    // Log the server error, but return false to the client
    return false;
  }
}

// Action for user login
export async function loginAction(psn: number, password?: string): Promise<{ success: boolean; message: string; user?: any }> {
  if (!firebaseAuth) {
    return { success: false, message: "Authentication service is unavailable." };
  }
  let lntUser;
  try {
    lntUser = await getUserByPsn(psn);
  } catch (error: any) {
    console.error("[Action Error] loginAction fetching user:", error.message);
    return { success: false, message: "A database connection error occurred. Please check server logs." };
  }

  if (!lntUser || !lntUser.businessEmail) {
    return { success: false, message: "PSN not found or no business email is associated with it." };
  }
  if (!password) {
    return { success: false, message: "Password is required." };
  }

  try {
    await signInWithEmailAndPassword(firebaseAuth, lntUser.businessEmail, password);
    return { success: true, message: "Login successful.", user: lntUser };
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
  if (!firebaseAuth) {
    return { success: false, message: "Authentication service is unavailable." };
  }

  let lntUser;
  try {
    lntUser = await getUserByPsn(psn);
  } catch (error: any) {
    console.error("[Action Error] signupAction fetching user:", error.message);
    return { success: false, message: "A database connection error occurred. Please check server logs." };
  }

  if (!lntUser || !lntUser.businessEmail) {
    return { success: false, message: "PSN not found or no business email is associated with it." };
  }
  if (!password) {
    return { success: false, message: "Password is required." };
  }

  try {
    await createUserWithEmailAndPassword(firebaseAuth, lntUser.businessEmail, password);
    return { success: true, message: "Account created successfully! You are now logged in." };
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
export async function getUserByEmailAction(email: string): Promise<{user: User | null}> {
    try {
        const user = await getUserByEmailQuery(email);
        return { user };
    } catch (error: any) {
        console.error("[Action Error] getUserByEmailAction:", error.message);
        return { user: null }; // Return null on error, log it.
    }
}

// Action for forgot password page
export async function getUserForPasswordResetAction(psn: number): Promise<{ businessEmail: string | undefined } | null> {
  try {
    const user = await getUserByPsn(psn);
    if (user) {
      // Return only the necessary data to the client
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
    revalidatePath('/dashboard'); // Revalidate dashboard to show new data potentially
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
    const firestore = require('@/lib/firebase').db;
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
