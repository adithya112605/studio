
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
        setLoading(false);
        return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser && firebaseUser.email) {
          const { user: lntUser, error } = await getUserByEmailAction(firebaseUser.email);
          
          if (lntUser) {
            setUser(lntUser);
          } else {
            const errorMessage = error || "Your authentication was successful, but we could not find a matching user profile. Please check your Firestore indexes or run `npm run db:seed`.";
            console.error(`[AuthContext] Firebase user ${firebaseUser.email} authenticated, but no L&T profile found. Error: ${errorMessage}`);
            toast({
              title: "Profile Mismatch",
              description: errorMessage,
              variant: "destructive",
              duration: 10000,
            });
            await signOut(auth);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (e: any) {
        console.error("[AuthContext] A critical error occurred during authentication state change:", e);
        toast({
            title: "Authentication Error",
            description: "A critical error occurred while verifying your profile. Please try again.",
            variant: "destructive",
            duration: 10000,
        });
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const checkPSNExists = async (psn: number): Promise<{ exists: boolean; error?: string }> => {
      const { exists, error } = await checkPSNExistsAction(psn);
      
      if (error) {
          toast({
              title: "Error Verifying PSN",
              description: error, 
              variant: "destructive",
              duration: 12000,
          });
          return { exists: false, error };
      }

      if (!exists) {
        toast({
          title: "PSN Not Found",
          description: "This PSN is not found in our database. Please run `npm run db:seed` or contact admin if you believe this is an error.",
          variant: "destructive",
          duration: 8000
        });
        return { exists: false, error: "PSN not found in database." };
      }

      return { exists: true, error: undefined };
  };

  const login = async (psn: number, password?: string): Promise<void> => {
    setLoading(true); // Set loading at the beginning of the login attempt.
    const result = await loginAction(psn, password);
    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Finalizing authentication...",
      });
      // On success, we DON'T set loading to false.
      // The onAuthStateChanged listener will do that once the user profile is fetched.
    } else {
      toast({
        title: "Login Failed",
        description: result.message,
        variant: "destructive",
        duration: 10000,
      });
      setLoading(false); // On failure, we must reset the loading state.
    }
  };

  const signup = async (psn: number, password?: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    const result = await signupAction(psn, password);
    if (!result.success) {
       toast({
        title: "Signup Failed",
        description: result.message,
        variant: "destructive",
        duration: 10000
      });
      setLoading(false);
    } else {
        toast({ title: "Account Created", description: result.message });
    }
    return result;
  };

  const logout = async () => {
    const auth = getAuthInstance();
    if (!auth) {
        toast({
            title: "Authentication Service Unavailable",
            description: "Firebase is not configured correctly. Please check your .env.local file and restart the server.",
            variant: "destructive",
            duration: 8000,
        });
        return;
    }
    try {
      await signOut(auth);
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
