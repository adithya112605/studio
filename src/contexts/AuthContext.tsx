
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

    const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        const { user: lntUser, error } = await getUserByEmailAction(firebaseUser.email);
        
        if (error === 'db_not_seeded') {
          toast(dbNotSeededMessage);
          setUser(null);
        } else if (error) {
          toast({ title: "Database Error", description: "An unexpected error occurred while fetching user data.", variant: "destructive" });
          setUser(null);
        } else if (lntUser) {
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
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const checkPSNExists = async (psn: number): Promise<boolean | 'db_error'> => {
    const result = await checkPSNExistsAction(psn);
    if (result === 'db_error') {
      toast(dbNotSeededMessage);
    }
    return result;
  };

  const login = async (psn: number, password?: string): Promise<boolean> => {
    const result = await loginAction(psn, password);
    if (!result.success) {
      if (result.message.includes("Firebase Authentication is not configured")) {
          toast({
            title: "Action Required in Firebase",
            description: "To fix this, go to your Firebase Console -> Authentication -> Sign-in method -> and Enable the Email/Password provider. This is a one-time setup.",
            variant: "destructive",
            duration: 9000
          });
      } else {
        toast({
          title: "Login Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    }
    // onAuthStateChanged will handle setting the user state.
    return result.success;
  };

  const signup = async (psn: number, password?: string): Promise<{ success: boolean; message: string }> => {
    const result = await signupAction(psn, password);
    if (!result.success) {
      if (result.message.includes("Firebase Authentication is not configured")) {
           toast({
            title: "Action Required in Firebase",
            description: "To fix this, go to your Firebase Console -> Authentication -> Sign-in method -> and Enable the Email/Password provider. This is a one-time setup.",
            variant: "destructive",
            duration: 9000
          });
      }
      // The signup form itself will show the error toast from its own submit handler.
    } else {
        toast({ title: "Account Created", description: result.message });
    }
    // onAuthStateChanged will handle login.
    return result;
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
