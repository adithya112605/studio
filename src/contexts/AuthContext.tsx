
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
    description: "Firebase is not configured correctly. Please check your .env.local file and restart the server.",
    variant: "destructive",
    duration: 8000,
} as const;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!firebaseAuth) {
        // The error is already logged in firebase.ts, so no need to log again.
        // Just set loading to false.
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        const lntUser = allMockUsers.find(u => u.businessEmail?.toLowerCase() === firebaseUser.email?.toLowerCase());
        
        if (lntUser) {
          setUser(lntUser);
        } else {
          console.error(`Firebase user ${firebaseUser.email} authenticated, but no matching L&T user profile was found. Logging out.`);
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
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const checkPSNExists = async (psn: number): Promise<boolean> => {
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
