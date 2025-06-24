
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
  
    // This listener handles session restoration on page refresh.
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser && firebaseUser.email) {
          // If we have a Firebase user but no local user yet, it's a refresh.
          // Fetch our detailed user profile.
          if (!user) {
            const { user: lntUser, error } = await getUserByEmailAction(firebaseUser.email);
            if (error) {
              console.error("Error fetching user profile during auth state change:", error);
              setUser(null);
            } else {
              setUser(lntUser);
            }
          }
        } else {
          // If Firebase has no user, our app has no user.
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
    // Intentionally not including `user` in deps to only run on mount for session restoration
  }, []);

  const login = async (psn: number, password?: string) => {
    // This is now a direct, atomic login function.
    setLoading(true);
    const result = await loginAction(psn, password);
    if (result.success && result.user) {
      setUser(result.user); // 1. Set user state
      router.push('/dashboard'); // 2. Redirect
      toast({ title: "Login Successful", description: `Welcome back, ${result.user.name}!` });
    } else {
      toast({
        title: "Login Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const signup = async (psn: number, password?: string) => {
    // This is now a direct, atomic signup function.
    setLoading(true);
    const result = await signupAction(psn, password);
    if (result.success && result.user) {
      setUser(result.user); // 1. Set user state
      router.push('/dashboard'); // 2. Redirect
      toast({ title: "Account Created!", description: `Welcome, ${result.user.name}!` });
    } else {
      toast({
        title: "Signup Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setLoading(false);
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
      setUser(null); // Explicitly clear the user state immediately
      router.push('/auth/signin'); // Then redirect
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
