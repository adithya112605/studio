
"use client"

import type { User } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  signOut,
  type User as FirebaseUser
} from "firebase/auth";
import { auth as firebaseAuth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  checkPSNExistsAction,
  getUserByEmailAction,
  loginAction,
  signupAction
} from '@/lib/actions';

interface AuthContextType {
  user: User | null;
  login: (psn: number, password?: string) => Promise<boolean>;
  signup: (psn: number, password?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  checkPSNExists: (psn: number) => Promise<{ exists: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!firebaseAuth) {
        setLoading(false);
        return;
    }

    const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        const { user: lntUser } = await getUserByEmailAction(firebaseUser.email);
        
        if (lntUser) {
          setUser(lntUser);
        } else {
          console.error(`Firebase user ${firebaseUser.email} authenticated, but no matching L&T user profile was found in Firestore. Logging out.`);
          toast({
            title: "Profile Mismatch",
            description: "Your authentication was successful, but we could not find a matching L&T user profile. Please run 'npm run db:seed' or contact IT support.",
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

  const checkPSNExists = async (psn: number): Promise<{ exists: boolean; error?: string }> => {
      const { exists, error } = await checkPSNExistsAction(psn);
      
      if (error) {
          let title = "Error Checking PSN";
          let description = error;

          if (error.includes("offline")) {
              title = "Firebase Connection Error";
              description = "The app could not connect to Firestore. This is usually a configuration issue. Please check: 1) Your .env.local file has the correct Firebase project details. 2) Firestore database is created and enabled in your Firebase project console. 3) Your Firestore security rules allow reads.";
          }

          toast({
              title: title,
              description: description,
              variant: "destructive",
              duration: 12000,
          });
          return { exists: false, error };
      }

      if (!exists) {
        toast({
          title: "PSN Not Found",
          description: "This PSN is not found in our database. Please run 'npm run db:seed' or contact admin if you believe this is an error.",
          variant: "destructive",
          duration: 8000
        });
        return { exists: false, error: "PSN not found in database." };
      }

      return { exists: true, error: undefined };
  };

  const login = async (psn: number, password?: string): Promise<boolean> => {
    const result = await loginAction(psn, password);
    if (!result.success) {
      let title = "Login Failed";
      let description = result.message;

      if (result.message.includes("offline")) {
        title = "Firebase Connection Error";
        description = "Could not connect to Firestore to verify user. Please check your Firebase project setup (see toast from previous screen for details) and refresh.";
      }
      
      toast({
        title: title,
        description: description,
        variant: "destructive",
        duration: 10000,
      });
    }
    // onAuthStateChanged will handle setting the user state.
    return result.success;
  };

  const signup = async (psn: number, password?: string): Promise<{ success: boolean; message: string }> => {
    const result = await signupAction(psn, password);
    if (!result.success) {
       let title = "Signup Failed";
       let description = result.message;

       if (result.message.includes("offline")) {
           title = "Firebase Connection Error";
           description = "Could not connect to Firestore to verify user. Please check your Firebase project setup (see toast from previous screen for details) and refresh.";
       }
       
       toast({
        title: title,
        description: description,
        variant: "destructive",
        duration: 10000
      });
    } else {
        toast({ title: "Account Created", description: result.message });
    }
    // onAuthStateChanged will handle login.
    return result;
  };

  const logout = async () => {
    if (!firebaseAuth) {
        toast({
            title: "Authentication Service Unavailable",
            description: "Firebase is not configured correctly. Please check your .env.local file and restart the server.",
            variant: "destructive",
            duration: 8000,
        });
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
