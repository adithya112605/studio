
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
    // This effect handles redirecting a user who is ALREADY logged in
    // away from the sign-in page.
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);
  
  // Show a loading spinner while the auth state is being determined.
  // This is mainly for the case where a user is already logged in and the page refreshes.
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
  // The form itself will handle the redirect upon successful login.
  if (!user) {
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
        <SignInForm />
        </div>
    );
  }

  // Fallback case: If there's a user but the redirect hasn't happened yet,
  // this state can show a spinner to avoid a flash of the login form.
  return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground">
            Redirecting to your dashboard...
          </p>
      </div>
  );
}
