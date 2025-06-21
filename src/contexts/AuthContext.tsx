
"use client"

import type { User, Employee, Supervisor } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  type User as FirebaseUser 
} from "firebase/auth";
import { auth as firebaseAuth } from '@/lib/firebase'; // This can now be undefined
import { mockEmployees, mockSupervisors, allMockUsers } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (psn: number, password?: string) => Promise<boolean>;
  signup: (psn: number, password?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  checkPSNExists: (psn: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const firebaseDisabledMessage = {
    title: "Authentication Service Unavailable",
    description: "Firebase is not configured correctly. Please check server logs and set up your .env.local file.",
    variant: "destructive",
    duration: 8000,
} as const;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // If firebaseAuth is undefined, it means initialization failed in firebase.ts
    if (!firebaseAuth) {
        console.error("AuthContext: Firebase Auth is not initialized. Disabling all authentication features.");
        setLoading(false);
        return; // Do not set up the listener
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser && firebaseUser.email) {
        const lntUser = allMockUsers.find(u => u.businessEmail?.toLowerCase() === firebaseUser.email?.toLowerCase());
        if (lntUser) {
          setUser(lntUser);
          localStorage.setItem('currentUser', JSON.stringify(lntUser));
        } else {
          console.error("Firebase user authenticated, but no matching L&T user found for email:", firebaseUser.email);
          setUser(null);
          localStorage.removeItem('currentUser');
          await signOut(firebaseAuth); 
          toast({
            title: "Login Issue",
            description: "Associated L&T user profile not found. Please contact support.",
            variant: "destructive",
          });
        }
      } else {
        setUser(null);
        localStorage.removeItem('currentUser');
      }
      setLoading(false);
    });

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.psn && parsedUser.name && parsedUser.role) {
          // This will be confirmed or denied by onAuthStateChanged
        } else {
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }

    return () => {
        if (unsubscribe) unsubscribe();
    };
  }, [toast]);


  const checkPSNExists = async (psn: number): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const userExistsInMockData = allMockUsers.some(u => u.psn === psn);
    setLoading(false);
    return userExistsInMockData;
  };

  const login = async (psn: number, password?: string): Promise<boolean> => {
    if (!firebaseAuth) {
        toast(firebaseDisabledMessage);
        return false;
    }
    setLoading(true);
    const lntUser = allMockUsers.find(u => u.psn === psn);

    if (!lntUser || !lntUser.businessEmail) {
      toast({
        title: "Login Failed",
        description: "PSN not found or no business email associated. Contact Admin.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
    if (!password) {
         toast({
            title: "Login Failed",
            description: "Password is required.",
            variant: "destructive",
        });
        setLoading(false);
        return false;
    }

    try {
      await signInWithEmailAndPassword(firebaseAuth, lntUser.businessEmail, password);
      return true;
    } catch (error: any) {
      console.error("Firebase login error:", error);
      let errorMessage = "An unknown error occurred during login.";
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = "Invalid PSN (email) or password.";
            break;
          case 'auth/invalid-email':
            errorMessage = "The associated email address is not valid.";
            break;
          default:
            errorMessage = error.message || "Failed to login. Please try again.";
        }
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  const signup = async (psn: number, password?: string): Promise<{ success: boolean; message: string }> => {
    if (!firebaseAuth) {
        toast(firebaseDisabledMessage);
        return { success: false, message: "Authentication service unavailable. Check configuration." };
    }
    setLoading(true);
    const lntUser = allMockUsers.find(u => u.psn === psn);

    if (!lntUser || !lntUser.businessEmail) {
      setLoading(false);
      return { success: false, message: "PSN not found or no business email associated. Cannot create account." };
    }
     if (!password) {
        setLoading(false);
        return { success: false, message: "Password is required for signup." };
    }

    try {
      await createUserWithEmailAndPassword(firebaseAuth, lntUser.businessEmail, password);
      return { success: true, message: "Account created successfully! You are now logged in." };
    } catch (error: any) {
      console.error("Firebase signup error:", error);
      let errorMessage = "An unknown error occurred during signup.";
       if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "This account (PSN/email) is already registered. Please try signing in.";
            break;
          case 'auth/weak-password':
            errorMessage = "The password is too weak. Please choose a stronger one.";
            break;
          case 'auth/invalid-email':
            errorMessage = "The associated email address for this PSN is not valid.";
            break;
          default:
            errorMessage = error.message || "Failed to create account. Please try again.";
        }
      }
      setLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    if (!firebaseAuth) {
        toast(firebaseDisabledMessage);
        return;
    }
    setLoading(true);
    try {
      await signOut(firebaseAuth);
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
