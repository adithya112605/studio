
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
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);
  
  // This will now show a loader ONLY when auth state is being checked,
  // or after a successful login while redirecting.
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

  // If not loading and no user, show the sign-in form.
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <SignInForm />
    </div>
  );
}
