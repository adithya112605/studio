
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
      console.error("[AuthContext] Firebase Auth not initialized. Cannot set up authentication listener.");
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser && firebaseUser.email) {
          // A user is signed in to Firebase. Let's fetch their app-specific profile.
          const { user: lntUser, error } = await getUserByEmailAction(firebaseUser.email);
          
          if (lntUser) {
            // Success: We found the matching profile in our database.
            setUser(lntUser);
          } else {
            // Critical Error: Firebase user exists, but no profile in our DB.
            // This can happen if a user is deleted from the app DB but not Firebase.
            // Log them out of Firebase to sync the state.
            const errorMessage = error || "Your authentication was successful, but we could not find a matching user profile. Please check your Firestore indexes or run `npm run db:seed`.";
            console.error(`[AuthContext] Firebase user ${firebaseUser.email} authenticated, but no L&T profile found. Signing out. Error: ${errorMessage}`);
            toast({
              title: "Profile Not Found",
              description: errorMessage,
              variant: "destructive",
              duration: 10000,
            });
            await signOut(auth); // This will trigger the listener again with a null user.
            setUser(null);
          }
        } else {
          // No Firebase user is signed in.
          setUser(null);
        }
      } catch (e: any) {
        // Catch any unexpected errors during profile fetch.
        console.error("[AuthContext] Unexpected error in onAuthStateChanged:", e);
        toast({
            title: "Authentication Error",
            description: "An unexpected error occurred while verifying your session. Please try again.",
            variant: "destructive"
        });
        setUser(null);
      } finally {
        // This block is GUARANTEED to run, ensuring we never get stuck in an infinite loading state.
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
    setLoading(true); // Set loading for the login attempt. The listener will set it to false.
    const result = await loginAction(psn, password);
    if (!result.success) {
      toast({
        title: "Login Failed",
        description: result.message,
        variant: "destructive",
        duration: 10000,
      });
      setLoading(false); // On direct failure, we must reset the loading state here.
    }
    // On success, we don't need to do anything. The onAuthStateChanged listener will handle it.
  };

  const signup = async (psn: number, password?: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true); // Set loading for the signup attempt.
    const result = await signupAction(psn, password);
    if (!result.success) {
       toast({
        title: "Signup Failed",
        description: result.message,
        variant: "destructive",
        duration: 10000
      });
      setLoading(false); // On failure, reset loading state.
    } else {
        toast({ title: "Account Created", description: result.message });
    }
    // On success, the onAuthStateChanged listener will handle the new user and set loading to false.
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
      // setUser(null) will be handled by the onAuthStateChanged listener.
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
