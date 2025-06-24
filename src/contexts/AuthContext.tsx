
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
  login: (psn: number, password?: string) => Promise<{ success: boolean; message: string }>;
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
  const router = useRouter();

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
          const { user: lntUser, error } = await getUserByEmailAction(firebaseUser.email);
           if (error) {
             console.error("Error fetching user profile during auth state change:", error);
             setUser(null);
           } else {
             setUser(lntUser);
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
  }, []);

  const login = async (psn: number, password?: string) => {
    try {
      const result = await loginAction(psn, password);
      if (result.success) {
        // onAuthStateChanged will handle setting the user and loading state.
        toast({ title: "Login Successful", description: `Welcome back, ${result.user?.name}!` });
      } else {
        toast({
          title: "Login Failed",
          description: result.message,
          variant: "destructive",
        });
      }
      return { success: result.success, message: result.message };
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      return { success: false, message: error.message || "An unexpected error occurred." };
    }
  };

  const signup = async (psn: number, password?: string) => {
    try {
      const result = await signupAction(psn, password);
      if (result.success) {
        // onAuthStateChanged will handle setting the user.
        toast({ title: "Account Created!", description: `Welcome, ${result.user?.name}!` });
      } else {
        toast({
          title: "Signup Failed",
          description: result.message,
          variant: "destructive",
        });
      }
       return { success: result.success, message: result.message };
    } catch (error: any) {
      toast({
        title: "Signup Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      return { success: false, message: error.message || "An unexpected error occurred." };
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
      // onAuthStateChanged will set user to null
      router.push('/auth/signin');
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
