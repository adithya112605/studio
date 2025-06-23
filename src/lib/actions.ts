
'use server';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';
import {
  getUserByPsn,
  getAllEmployees,
  getAllSupervisors,
  getAllProjects as getAllProjectsQuery,
  getAllJobCodes as getAllJobCodesQuery,
  getAllGrades as getAllGradesQuery,
  addEmployee as addEmployeeQuery,
  addSupervisor as addSupervisorQuery,
  createTicket as createTicketQuery,
  getSupervisorByPsn as getSupervisorByPsnQuery,
} from '@/lib/queries';
import type { User, AddEmployeeFormData, AddSupervisorFormData, Ticket } from '@/types';
import { revalidatePath } from 'next/cache';

// Action to check if a PSN exists
export async function checkPSNExistsAction(psn: number): Promise<boolean | 'db_error'> {
  try {
    const user = await getUserByPsn(psn);
    return !!user;
  } catch (error: any) {
    if (error.message.includes('no such table')) {
      return 'db_error';
    }
    console.error("Error in checkPSNExistsAction:", error);
    return 'db_error';
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
    if (error.message.includes('no such table')) {
      return { success: false, message: "Database not seeded. Please run `npm run db:seed`." };
    }
    return { success: false, message: "An unexpected database error occurred." };
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
     if (error.message.includes('no such table')) {
      return { success: false, message: "Database not seeded. Please run `npm run db:seed`." };
    }
    return { success: false, message: "An unexpected database error occurred." };
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
export async function getUserByEmailAction(email: string): Promise<{user: User | null, error?: string}> {
    try {
        const allEmployees = await getAllEmployees();
        const employee = allEmployees.find(e => e.businessEmail?.toLowerCase() === email.toLowerCase());

        if (employee) {
            const lntUser = await getUserByPsn(employee.psn);
            return { user: lntUser };
        }
        
        const allSupervisors = await getAllSupervisors();
        const supervisor = allSupervisors.find(s => s.businessEmail?.toLowerCase() === email.toLowerCase());
        if (supervisor) {
            const lntUser = await getUserByPsn(supervisor.psn);
            return { user: lntUser };
        }

        return { user: null };

    } catch (error: any) {
        if (error.message.includes('no such table')) {
            return { user: null, error: 'db_not_seeded' };
        }
        console.error("Database error in getUserByEmailAction:", error);
        return { user: null, error: 'db_error' };
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
    if (error.message.includes('no such table')) {
        // Don't leak db state, just treat as not found
    }
    console.error("Error in getUserForPasswordResetAction:", error);
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
    return { ticketId: newTicketId, supervisorName };
}
