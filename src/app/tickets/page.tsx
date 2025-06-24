
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types';
import { Loader2 } from 'lucide-react';

// This page component will handle redirection logic for the base /tickets route.
export default function TicketsRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      // Still loading user authentication state, do nothing yet.
      return;
    }

    if (!user) {
      // Not authenticated, redirect to sign-in.
      router.replace('/auth/signin?redirect=/tickets'); // Optionally add redirect query
      return;
    }

    // User is authenticated, redirect based on role.
    if (user.role === 'Employee') {
      router.replace('/employee/tickets');
    } else if (['IS', 'NS', 'DH', 'IC Head'].includes(user.role)) {
      router.replace('/hr/tickets');
    } else {
      // Fallback, though this case should ideally not be reached if roles are well-defined.
      // Redirect to a general home page.
      router.replace('/');
    }
  }, [user, loading, router]);

  // Render a loading state while the redirect is processed.
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Redirecting to your tickets page...</p>
    </div>
  );
}
