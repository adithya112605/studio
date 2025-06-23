
"use client"

import type { User } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  signOut,
  type User as FirebaseUser
} from "firebase/auth";
import { getAuthInstance } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  checkPSNExistsAction,
  getUserByEmailAction,
  loginAction,
  signupAction
} from '@/lib/actions';

interface AuthContextType {
  user: User | null;
  login: (psn: number, password?: string) => Promise<void>;
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
    const auth = getAuthInstance();
    if (!auth) {
      console.error("[AuthContext] Firebase Auth not initialized.");
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser && firebaseUser.email) {
          // A user has an active session from a previous login.
          // Let's fetch their app-specific profile to populate the context.
          if (!user) { // Only fetch if user is not already set by an active login flow
            const { user: lntUser, error } = await getUserByEmailAction(firebaseUser.email);
            if (lntUser) {
              setUser(lntUser);
            } else {
              console.error(`[AuthContext] Session check failed: no L&T profile for ${firebaseUser.email}. Error: ${error}`);
              await signOut(auth);
              setUser(null);
            }
          }
        } else {
          // No Firebase user is signed in.
          setUser(null);
        }
      } catch (e: any) {
        console.error("[AuthContext] Unexpected error in onAuthStateChanged:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]); // Rerun if user changes to handle logout case properly.

  const checkPSNExists = async (psn: number): Promise<{ exists: boolean; error?: string }> => {
      const { exists, error } = await checkPSNExistsAction(psn);
      
      if (error) {
          toast({ title: "Error Verifying PSN", description: error, variant: "destructive" });
          return { exists: false, error };
      }
      return { exists, error: undefined };
  };

  const login = async (psn: number, password?: string): Promise<void> => {
    setLoading(true);
    const result = await loginAction(psn, password);

    if (result.success && result.user) {
      setUser(result.user);
      // Let the signin page handle the redirect toast.
    } else {
      toast({
        title: "Login Failed",
        description: result.message,
        variant: "destructive",
        duration: 8000,
      });
      setUser(null);
    }
    setLoading(false);
  };

  const signup = async (psn: number, password?: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    const result = await signupAction(psn, password);
    if (result.success && result.user) {
        setUser(result.user);
        toast({ title: "Account Created!", description: "You are now logged in." });
    } else {
       toast({
        title: "Signup Failed",
        description: result.message,
        variant: "destructive",
      });
       setUser(null);
    }
    setLoading(false);
    return { success: result.success, message: result.message };
  };

  const logout = async () => {
    setLoading(true);
    const auth = getAuthInstance();
    if (!auth) {
      toast({ title: "Logout Error", description: "Auth service not available.", variant: "destructive" });
      setLoading(false);
      return;
    }
    try {
      await signOut(auth);
      setUser(null);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
      console.error("Firebase logout error: ", error);
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
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
