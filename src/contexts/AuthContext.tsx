
"use client"

import type { User } from '@/types';
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
import { allMockUsers } from '@/data/mockData';
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
    description: "Firebase is not configured correctly. Authentication features are disabled.",
    variant: "destructive",
    duration: 8000,
} as const;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // True until the first auth check is complete
  const { toast } = useToast();

  useEffect(() => {
    // If firebaseAuth is not initialized, authentication is disabled.
    if (!firebaseAuth) {
        console.warn("AuthContext: Firebase Auth is not initialized. Disabling all authentication features.");
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        const lntUser = allMockUsers.find(u => u.businessEmail?.toLowerCase() === firebaseUser.email?.toLowerCase());
        
        if (lntUser) {
          setUser(lntUser);
        } else {
          // This is a critical state: Firebase user exists, but no matching L&T profile.
          // Log them out of Firebase to prevent being stuck in this state.
          console.error(`Firebase user ${firebaseUser.email} authenticated, but no matching L&T user profile was found.`);
          toast({
            title: "Profile Mismatch",
            description: "Your authentication was successful, but we could not find a matching L&T user profile. Please contact IT support.",
            variant: "destructive",
            duration: 8000,
          });
          await signOut(firebaseAuth);
          setUser(null);
        }
      } else {
        // No Firebase user, so no L&T user.
        setUser(null);
      }
      // The first time this runs, the initial loading is complete.
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);

  const checkPSNExists = async (psn: number): Promise<boolean> => {
    // This is a mock check and can stay as is.
    await new Promise(resolve => setTimeout(resolve, 300));
    return allMockUsers.some(u => u.psn === psn);
  };

  const login = async (psn: number, password?: string): Promise<boolean> => {
    if (!firebaseAuth) {
        toast(firebaseDisabledMessage);
        return false;
    }

    const lntUser = allMockUsers.find(u => u.psn === psn);

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
      // onAuthStateChanged will handle setting the user state and redirecting.
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
            errorMessage = "Authentication is not configured correctly. Please enable Email/Password sign-in in your Firebase project console.";
            break;
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

    const lntUser = allMockUsers.find(u => u.psn === psn);

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
            errorMessage = "Authentication is not configured correctly. Please enable Email/Password sign-in in your Firebase project console.";
            break;
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
      // onAuthStateChanged will set user to null.
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
