
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
import { useRouter, usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) {
      console.error("[AuthContext] Firebase Auth not initialized.");
      setLoading(false);
      return;
    }

    // This listener is the single source of truth for the user's auth state.
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // If the user state is already correct, don't do anything.
          if (user && user.businessEmail === firebaseUser.email) return;

          // User is signed in to Firebase, now get their profile from our database.
          const { user: lntUser, error } = await getUserByEmailAction(firebaseUser.email!);
          if (lntUser) {
            setUser(lntUser);
            // After successful login and profile fetch, redirect from auth pages.
            const authRoutes = ['/auth/signin', '/auth/signup'];
            if (authRoutes.includes(pathname)) {
                 router.replace('/dashboard');
            }
          } else {
            // Logged into Firebase, but no profile in our DB. This is an error state.
            console.error(`[AuthContext] Auth-DB Mismatch: L&T profile not found for ${firebaseUser.email}. Error: ${error || 'Unknown DB error.'}`);
            toast({ title: "Profile Not Found", description: "Your account exists but we could not find your profile details. Please contact support.", variant: "destructive" });
            await signOut(auth); // Sign out from Firebase to clean up state.
          }
        } else {
          // No user is signed in to Firebase.
          setUser(null);
        }
      } catch(e) {
         console.error("[AuthContext] Critical error in onAuthStateChanged:", e);
         setUser(null); // Ensure user is logged out on error
      }
      finally {
        // This is crucial: always set loading to false after processing.
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname, router, user]); // Add dependencies to re-run if needed, but the logic inside prevents loops.

  const login = async (psn: number, password?: string): Promise<void> => {
    try {
      const result = await loginAction(psn, password);
      // The onAuthStateChanged listener above will handle setting the user state and redirection.
      // We just show success/failure toasts here.
      if (result.success && result.user) {
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
    }
  };

  const signup = async (psn: number, password?: string): Promise<void> => {
    try {
      const result = await signupAction(psn, password);
      if (result.success && result.user) {
        toast({ title: "Account Created!", description: `Welcome, ${result.user.name}!` });
         // The onAuthStateChanged listener will handle the rest.
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
      // The onAuthStateChanged listener will set user to null.
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
