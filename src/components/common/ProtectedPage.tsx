"use client"

import React, { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { User } from '@/types';

interface ProtectedPageProps {
  children: ReactNode | ((user: User) => ReactNode);
  allowedRoles?: User['role'][];
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/signin');
    } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      // User is logged in but doesn't have the required role
      // Redirect to a general dashboard or an unauthorized page
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this page.",
        variant: "destructive"
      });
      router.replace('/dashboard'); 
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
     // This case should ideally be caught by useEffect redirect, but as a fallback:
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You do not have the necessary permissions to view this page.</p>
        <Button onClick={() => router.push('/dashboard')} className="mt-4">Go to Dashboard</Button>
      </div>
    );
  }
  
  return typeof children === 'function' ? children(user) : children;
};

// This is just a helper, actual toast needs to be imported and used within a component with Toaster setup
const toast = (options: {title: string, description: string, variant?: "destructive"}) => {
  if (typeof window !== "undefined") {
    // In a real app, you'd integrate with the actual useToast hook here
    console.warn(`Toast: ${options.title} - ${options.description}`);
  }
};
import { Button } from '@/components/ui/button'; // Ensure Button is imported

export default ProtectedPage;
