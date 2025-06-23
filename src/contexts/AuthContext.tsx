
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
      setLoading(true); // Always start loading when auth state changes
      try {
        if (firebaseUser && firebaseUser.email) {
          // A user session exists. Fetch our app-specific user profile.
          const { user: lntUser, error } = await getUserByEmailAction(firebaseUser.email);
          if (lntUser) {
            setUser(lntUser);
          } else {
            const errorMessage = `L&T profile not found for ${firebaseUser.email}. You may need to run the db:seed script or check Firestore indexes. Logging out. Error: ${error}`;
            console.error(`[AuthContext] onAuthStateChanged: ${errorMessage}`);
            toast({ title: "Profile Error", description: errorMessage, variant: "destructive", duration: 10000 });
            await signOut(auth); // This will re-trigger onAuthStateChanged with null
            setUser(null);
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
  }, []); // CRITICAL FIX: Empty dependency array. This should only run once.


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

    if (!result.success) {
      toast({
        title: "Login Failed",
        description: result.message,
        variant: "destructive",
        duration: 8000,
      });
      setUser(null);
      setLoading(false);
    }
    // On success, we don't call setUser or setLoading(false) here.
    // The onAuthStateChanged listener will be triggered by a successful login,
    // and it will handle setting the user and setting loading to false.
  };

  const signup = async (psn: number, password?: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    const result = await signupAction(psn, password);
    if (!result.success) {
       toast({
        title: "Signup Failed",
        description: result.message,
        variant: "destructive",
      });
       setUser(null);
       setLoading(false);
    }
    // On success, let onAuthStateChanged handle it.
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
      // setUser(null) and setLoading(false) will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Firebase logout error: ", error);
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" });
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
