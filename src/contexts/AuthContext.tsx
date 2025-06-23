
"use client"

import type { User, Supervisor, Employee } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  type User as FirebaseUser 
} from "firebase/auth";
import { auth as firebaseAuth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { getUserByPsn, getEmployeeByPsn, getAllEmployees } from '@/lib/queries';

interface AuthContextType {
  user: User | null;
  login: (psn: number, password?: string) => Promise<boolean>;
  signup: (psn: number, password?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  checkPSNExists: (psn: number) => Promise<boolean | 'db_error'>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const firebaseDisabledMessage = {
    title: "Authentication Service Unavailable",
    description: "Firebase is not configured correctly. Please check your .env.local file and restart the server.",
    variant: "destructive",
    duration: 8000,
} as const;

const dbNotSeededMessage = {
    title: "Database Not Ready",
    description: "Database tables not found. Please run `npm run db:seed` in your terminal and then refresh the page.",
    variant: "destructive",
    duration: 10000,
} as const;


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!firebaseAuth) {
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        try {
            // Find user by email in the database
            const allEmployees = await getAllEmployees();
            // This is a simplification. In a real scenario, you'd have a users table with unique emails.
            // Here we have to check both employees and supervisors tables.
            const employee = allEmployees.find(e => e.businessEmail?.toLowerCase() === firebaseUser.email!.toLowerCase());

            let lntUser: User | null = await getUserByPsn(employee?.psn || 0);
            
            if (lntUser) {
              setUser(lntUser);
            } else {
              console.error(`Firebase user ${firebaseUser.email} authenticated, but no matching L&T user profile was found in DB. Logging out.`);
              toast({
                title: "Profile Mismatch",
                description: "Your authentication was successful, but we could not find a matching L&T user profile. Please contact IT support.",
                variant: "destructive",
                duration: 8000,
              });
              await signOut(firebaseAuth);
              setUser(null);
            }
        } catch (error: any) {
            if (error.message.includes('no such table')) {
                console.warn("[DB WARNING] Database not seeded. Tables are missing. Run `npm run db:seed`.");
                // We can't find a user if tables don't exist, so treat as logged out.
                setUser(null);
            } else {
                console.error("Database error in AuthContext:", error);
                setUser(null);
            }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const checkPSNExists = async (psn: number): Promise<boolean | 'db_error'> => {
    try {
        const user = await getUserByPsn(psn);
        return !!user;
    } catch (error: any) {
        if (error.message.includes('no such table')) {
            toast(dbNotSeededMessage);
            return 'db_error';
        }
        throw error; // Re-throw other errors
    }
  };

  const login = async (psn: number, password?: string): Promise<boolean> => {
    if (!firebaseAuth) {
        toast(firebaseDisabledMessage);
        return false;
    }

    let lntUser: User | null;
    try {
        lntUser = await getUserByPsn(psn);
    } catch (error: any) {
        if (error.message.includes('no such table')) {
            toast(dbNotSeededMessage);
            return false;
        }
        toast({ title: "Database Error", description: "An unexpected database error occurred.", variant: "destructive" });
        return false;
    }


    if (!lntUser || !lntUser.businessEmail) {
      toast({
        title: "Login Failed",
        description: "PSN not found or no business email is associated with it. Please contact Admin.",
        variant: "destructive",
      });
      return false;
    }

    if (!password) {
        toast({
            title: "Login Failed",
            description: "Password is required.",
            variant: "destructive",
        });
        return false;
    }

    try {
      await signInWithEmailAndPassword(firebaseAuth, lntUser.businessEmail, password);
      // onAuthStateChanged will handle setting the user state.
      return true;
    } catch (error: any) {
      console.error("Firebase login error:", error);
      let errorMessage = "An unknown error occurred during login.";
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = "Invalid PSN or password.";
            break;
          case 'auth/invalid-email':
            errorMessage = "The business email associated with this PSN is invalid.";
            break;
          case 'auth/configuration-not-found':
            toast({
              title: "Action Required in Firebase",
              description: "To fix this, go to your Firebase Console -> Authentication -> Sign-in method -> and Enable the Email/Password provider. This is a one-time setup.",
              variant: "destructive",
              duration: 9000
            });
            return false;
          default:
            errorMessage = error.message;
        }
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (psn: number, password?: string): Promise<{ success: boolean; message: string }> => {
    if (!firebaseAuth) {
        toast(firebaseDisabledMessage);
        return { success: false, message: "Authentication service is unavailable." };
    }

    let lntUser: User | null;
    try {
        lntUser = await getUserByPsn(psn);
    } catch(error: any) {
        if (error.message.includes('no such table')) {
            toast(dbNotSeededMessage);
            return { success: false, message: "Database is not set up." };
        }
        return { success: false, message: "An unexpected database error occurred." };
    }


    if (!lntUser || !lntUser.businessEmail) {
      return { success: false, message: "PSN not found or no business email is associated with it. Cannot create account." };
    }

    if (!password) {
        return { success: false, message: "Password is required for signup." };
    }

    try {
      await createUserWithEmailAndPassword(firebaseAuth, lntUser.businessEmail, password);
      // onAuthStateChanged will handle setting the user state and redirecting.
      return { success: true, message: "Account created successfully! You are now logged in." };
    } catch (error: any) {
      console.error("Firebase signup error:", error);
      let errorMessage = "An unknown error occurred during signup.";
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "This account (based on your PSN) has already been registered. Please try signing in instead.";
            break;
          case 'auth/weak-password':
            errorMessage = "The password is too weak. Please choose a stronger one.";
            break;
          case 'auth/invalid-email':
            errorMessage = "The business email associated with this PSN is invalid.";
            break;
          case 'auth/configuration-not-found':
             toast({
              title: "Action Required in Firebase",
              description: "To fix this, go to your Firebase Console -> Authentication -> Sign-in method -> and Enable the Email/Password provider. This is a one-time setup.",
              variant: "destructive",
              duration: 9000
            });
            return { success: false, message: "Server configuration needed." };
          default:
            errorMessage = error.message;
        }
      }
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    if (!firebaseAuth) {
        toast(firebaseDisabledMessage);
        return;
    }
    try {
      await signOut(firebaseAuth);
      setUser(null);
    } catch (error) {
      console.error("Firebase logout error: ", error);
      toast({
        title: "Logout Failed",
        description: "Could not log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, checkPSNExists }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
