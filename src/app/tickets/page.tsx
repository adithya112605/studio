
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
      // Redirect to a general dashboard or home.
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Render a loading state while the redirect is processed.
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <dotlottie-player
            src="https://lottie.host/9f6bb697-7e60-4d75-a238-224ffbcec9e0/f3SUaqz2Lp.lottie"
            background="transparent"
            speed="1"
            style={{ width: '300px', height: '300px' }}
            loop
            autoplay
        ></dotlottie-player>
      <p className="text-muted-foreground -mt-8">Redirecting to your tickets page...</p>
    </div>
  );
}
