
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
      setLoading(true);
      try {
        if (firebaseUser && firebaseUser.email) {
          const { user: lntUser, error } = await getUserByEmailAction(firebaseUser.email);
          if (lntUser) {
            setUser(lntUser);
          } else {
            const errorMessage = `L&T profile not found for ${firebaseUser.email}. This can happen if the user was deleted from the database but not from Firebase Auth. Logging out. Error: ${error || 'Unknown DB error.'}`;
            console.error(`[AuthContext] onAuthStateChanged: ${errorMessage}`);
            toast({ title: "Profile Error", description: errorMessage, variant: "destructive", duration: 10000 });
            await signOut(auth); // This will re-trigger the listener with a null user
            setUser(null); // Explicitly set user to null here
          }
        } else {
          setUser(null);
        }
      } catch (e: any) {
        console.error("[AuthContext] Unexpected error in onAuthStateChanged:", e);
        setUser(null);
      } finally {
        // This block GUARANTEES the loading state is always updated.
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const checkPSNExists = async (psn: number): Promise<{ exists: boolean; error?: string }> => {
      const { exists, error } = await checkPSNExistsAction(psn);
      
      if (error) {
          toast({ title: "Error Verifying PSN", description: error, variant: "destructive" });
          return { exists: false, error };
      }
      return { exists, error: undefined };
  };

  const login = async (psn: number, password?: string): Promise<void> => {
    const result = await loginAction(psn, password);
    if (!result.success) {
      toast({
        title: "Login Failed",
        description: result.message,
        variant: "destructive",
        duration: 8000,
      });
      // The onAuthStateChanged listener will handle state changes.
      // We throw an error to let the calling form know the login failed.
      throw new Error(result.message);
    }
    // On success, onAuthStateChanged will automatically handle setting the user and loading state.
  };

  const signup = async (psn: number, password?: string): Promise<{ success: boolean; message: string }> => {
    const result = await signupAction(psn, password);
    if (!result.success) {
       toast({
        title: "Signup Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    // On success, onAuthStateChanged will handle setting the user and loading state.
    return { success: result.success, message: result.message };
  };

  const logout = async () => {
    const auth = getAuthInstance();
    if (!auth) {
      toast({ title: "Logout Error", description: "Auth service not available.", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      await signOut(auth);
      // onAuthStateChanged will handle setting user to null.
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
