
"use client";

import SignInForm from '@/components/auth/SignInForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the auth state is done loading and we have a user, redirect to the dashboard.
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);
  
  // While checking auth state or if a user is found and we are about to redirect, show a loader.
  // This prevents a "flash" of the sign-in form for already authenticated users.
  if (loading || user) { 
      return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            {loading ? 'Checking authentication...' : 'Redirecting to dashboard...'}
          </p>
      </div>
    );
  }

  // If not loading and no user, it's safe to show the sign-in form.
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <SignInForm />
    </div>
  );
}
