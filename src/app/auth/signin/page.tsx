
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
    // This handles the case where a logged-in user navigates to the sign-in page.
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);
  
  // While the context is verifying the initial auth state, show a loader.
  if (loading) { 
      return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Checking authentication...
          </p>
      </div>
    );
  }

  // If not loading and no user, it's safe to show the sign-in form.
  // The redirection on successful login is now handled by the AuthContext.
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <SignInForm />
    </div>
  );
}
