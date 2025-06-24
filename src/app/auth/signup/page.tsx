
"use client";

import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth state is resolved and a user exists, they should be on the dashboard.
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Show a loader while we determine auth state or if a user is being redirected.
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Verifying account...
          </p>
      </div>
    );
  }

  // Only show the form if we are not loading and there's no user.
  // The redirection on successful signup is now handled by the AuthContext.
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <SignUpForm />
    </div>
  );
}
