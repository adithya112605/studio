
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-8 bg-background text-foreground">
      <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
      <h1 className="font-headline text-5xl font-normal tracking-wide text-foreground mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-md">
        Oops! The page you are looking for does not exist, has been moved, or is temporarily unavailable.
      </p>
      <Button asChild size="lg">
        <Link href="/">
          Go to Homepage
        </Link>
      </Button>
    </div>
  );
}
