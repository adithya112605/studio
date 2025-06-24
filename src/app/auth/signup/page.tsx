
"use client";

import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function SignUpPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect handles the case where a user who is ALREADY logged in
    // navigates to the sign-up page. It safely redirects them.
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
            Verifying account...
          </p>
      </div>
    );
  }

  // If not loading and no user, show the form.
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
        <SignUpForm />
      </div>
    );
  }
  
  // Fallback case: User exists, redirecting...
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">
          Redirecting to your dashboard...
        </p>
    </div>
  );
}
