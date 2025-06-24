
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
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (psn: number, password?: string) => Promise<void>;
  signup: (psn: number, password?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  checkPSNExists: (psn: number) => Promise<{ exists: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) {
      console.error("[AuthContext] Firebase Auth not initialized.");
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      // This listener now primarily handles session persistence across page reloads.
      // The initial login sets the user state directly.
      if (firebaseUser && !user) {
        setLoading(true);
        try {
          const { user: lntUser, error } = await getUserByEmailAction(firebaseUser.email!);
          if (lntUser) {
            setUser(lntUser);
          } else {
            console.error(`[AuthContext] onAuthStateChanged: L&T profile not found for ${firebaseUser.email}. Error: ${error || 'Unknown DB error.'}`);
            await signOut(auth); // This will re-trigger the listener with a null user
          }
        } catch (e: any) {
          console.error("[AuthContext] Unexpected error in onAuthStateChanged:", e);
          await signOut(auth);
        } finally {
          setLoading(false);
        }
      } else if (!firebaseUser) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

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
    try {
      const result = await loginAction(psn, password);
      if (result.success && result.user) {
        setUser(result.user);
        router.push('/dashboard');
        toast({ title: "Login Successful", description: `Welcome back, ${result.user.name}!` });
      } else {
        toast({
          title: "Login Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (psn: number, password?: string): Promise<void> => {
    setLoading(true);
    try {
      const result = await signupAction(psn, password);
      if (result.success && result.user) {
        setUser(result.user);
        router.push('/dashboard');
        toast({ title: "Account Created!", description: `Welcome, ${result.user.name}!` });
      } else {
        toast({
          title: "Signup Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Signup Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
      router.push('/auth/signin'); // Redirect to signin page
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
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
