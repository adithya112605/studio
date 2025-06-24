
"use client";

import SignInForm from '@/components/auth/SignInForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function SignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect handles the case where a user who is ALREADY logged in
    // (e.g., after a successful login or on page refresh)
    // navigates to the sign-in page. It safely redirects them.
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);
  
  // The main loading indicator for the initial auth check.
  if (loading) { 
      return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground">
            Checking authentication...
          </p>
      </div>
    );
  }

  // If not loading and no user, it's safe to show the sign-in form.
  if (!user) {
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
        <SignInForm />
        </div>
    );
  }

  // Fallback case, should not be reached if logic is correct
  return null;
}
