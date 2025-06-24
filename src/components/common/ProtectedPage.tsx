
"use client"

import React, { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { User } from '@/types';
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { Button } from '@/components/ui/button';

interface ProtectedPageProps {
  children: ReactNode | ((user: User) => ReactNode);
  allowedRoles?: User['role'][];
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast(); // Use the imported hook

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/signin');
    } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      toast({ // Use the destructured toast function
        title: "Access Denied",
        description: "You do not have permission to view this page.",
        variant: "destructive"
      });
      router.replace('/');
    }
  }, [user, loading, router, allowedRoles, toast]); // Add toast to the dependency array

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Verifying your session...</p>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You do not have the necessary permissions to view this page.</p>
        <Button onClick={() => router.push('/')} className="mt-4">Go to Home</Button>
      </div>
    );
  }

  return typeof children === 'function' ? children(user) : children;
};

export default ProtectedPage;
