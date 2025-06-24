
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
  login: (psn: number, password?: string) => Promise<boolean>;
  signup: (psn: number, password?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  checkPSNExists: (psn: number) => Promise<{ exists: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // For initial page load auth check
  const { toast } = useToast();
  const router = useRouter();

  // This effect runs once on mount to check the initial authentication state from Firebase.
  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) {
      console.error("[AuthContext] Firebase Auth not initialized.");
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // If we don't have a user profile yet, fetch it.
        if (!user) {
            const { user: lntUser } = await getUserByEmailAction(firebaseUser.email!);
            setUser(lntUser);
        }
      } else {
        // No Firebase user, so ensure local user state is null.
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (psn: number, password?: string): Promise<boolean> => {
    try {
      const result = await loginAction(psn, password);
      if (result.success && result.user) {
        setUser(result.user); // Set user state immediately
        toast({ title: "Login Successful", description: `Welcome back, ${result.user.name}!` });
        router.push('/dashboard'); // Redirect on success
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: result.message,
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (psn: number, password?: string): Promise<boolean> => {
    try {
      const result = await signupAction(psn, password);
      if (result.success && result.user) {
        setUser(result.user);
        toast({ title: "Account Created!", description: `Welcome, ${result.user.name}!` });
        router.push('/dashboard'); // Redirect on success
        return true;
      } else {
        toast({
          title: "Signup Failed",
          description: result.message,
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Signup Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    }
  };

  const checkPSNExists = async (psn: number): Promise<{ exists: boolean; error?: string }> => {
      const { exists, error } = await checkPSNExistsAction(psn);
      
      if (error) {
          toast({ title: "Error Verifying PSN", description: error, variant: "destructive" });
          return { exists: false, error };
      }
      return { exists, error: undefined };
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
