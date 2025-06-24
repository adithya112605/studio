
"use client"

import type { User } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  signOut,
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getAuthInstance } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  checkPSNExistsAction,
  getUserByEmailAction,
  getSupervisorByPsnAction,
  getEmployeeByPsn,
} from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  // Make login/signup simpler, they just handle the auth and state. Redirect is handled by the form.
  login: (psn: number, password?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  signup: (psn: number, password?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => Promise<void>;
  loading: boolean;
  checkPSNExists: (psn: number) => Promise<{ exists: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get user from either collection, used by both login and signup.
async function getLntUserByPsn(psn: number): Promise<User | null> {
    const supervisor = await getSupervisorByPsnAction(psn);
    if (supervisor) return supervisor;
    const employee = await getEmployeeByPsn(psn);
    if (employee) return employee;
    return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  
  // This listener is for session persistence on page refresh.
  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) {
      console.error("[AuthContext] Firebase Auth not initialized.");
      setLoading(false);
      return;
    }
  
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser && firebaseUser.email) {
          // If a firebase user is found, but we don't have our app user yet, fetch it.
          // This handles the case of refreshing the page.
          if (!user) {
            const { user: lntUser, error } = await getUserByEmailAction(firebaseUser.email);
            if (error) {
              console.error("Error fetching user profile during auth state change:", error);
              setUser(null);
            } else {
              setUser(lntUser);
            }
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error during auth state change:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const login = async (psn: number, password?: string) => {
    const auth = getAuthInstance();
    if (!auth || !password) {
      const message = !auth ? "Authentication service is unavailable." : "Password is required.";
      toast({ title: "Login Failed", description: message, variant: "destructive" });
      return { success: false, message };
    }

    try {
      const lntUserForEmail = await getLntUserByPsn(psn);
      if (!lntUserForEmail || !lntUserForEmail.businessEmail) {
        const message = "PSN not found or no business email is associated with it.";
        toast({ title: "Login Failed", description: message, variant: "destructive" });
        return { success: false, message };
      }

      await signInWithEmailAndPassword(auth, lntUserForEmail.businessEmail, password);
      
      // After successful Firebase login, fetch our user profile and set it.
      // This makes the login process atomic and direct.
      const { user: lntUser, error } = await getUserByEmailAction(lntUserForEmail.businessEmail);
      if (error || !lntUser) {
        const message = "Login succeeded but failed to retrieve user profile.";
        toast({ title: "Login Error", description: message, variant: "destructive" });
        return { success: false, message };
      }

      setUser(lntUser);
      toast({ title: "Login Successful", description: `Welcome back, ${lntUser.name}!` });
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
          default:
            errorMessage = "Invalid credentials or network issue.";
            console.error("Firebase login error:", error);
        }
      }
      toast({ title: "Login Failed", description: errorMessage, variant: "destructive" });
      return { success: false, message: errorMessage };
    }
  };

  const signup = async (psn: number, password?: string) => {
    const auth = getAuthInstance();
    if (!auth || !password) {
      const message = !auth ? "Authentication service is unavailable." : "Password is required.";
      toast({ title: "Signup Failed", description: message, variant: "destructive" });
      return { success: false, message };
    }

    try {
      const lntUserForEmail = await getLntUserByPsn(psn);
      if (!lntUserForEmail || !lntUserForEmail.businessEmail) {
        const message = "PSN not found or no business email is associated with it.";
        toast({ title: "Signup Failed", description: message, variant: "destructive" });
        return { success: false, message };
      }

      await createUserWithEmailAndPassword(auth, lntUserForEmail.businessEmail, password);
      
      setUser(lntUserForEmail);
      toast({ title: "Account Created!", description: `Welcome, ${lntUserForEmail.name}!` });
      return { success: true, message: "Signup successful.", user: lntUserForEmail };

    } catch (error: any) {
      let errorMessage = "An unknown error occurred during signup.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This account has already been registered. Please sign in.";
      } else {
        console.error("Firebase signup error:", error);
      }
      toast({ title: "Signup Failed", description: errorMessage, variant: "destructive" });
      return { success: false, message: errorMessage };
    }
  };


  const checkPSNExists = async (psn: number): Promise<{ exists: boolean; error?: string }> => {
      return await checkPSNExistsAction(psn);
  };

  const logout = async () => {
    const auth = getAuthInstance();
    if (!auth) {
      toast({ title: "Logout Error", description: "Auth service not available.", variant: "destructive" });
      return;
    }
    try {
      await signOut(auth);
      setUser(null); // Explicitly clear user state
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/auth/signin');
    } catch (error) {
      console.error("Firebase logout error: ", error);
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" });
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
