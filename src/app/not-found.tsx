
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Keep Button for consistent styling
import { AlertTriangle } from 'lucide-react'; // Keep icon for visual cue

export default function NotFound() {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 10rem)', // Consistent with previous styling for full page feel
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'sans-serif' // Basic font
      }}
    >
      <AlertTriangle style={{ width: '64px', height: '64px', color: '#dc2626', marginBottom: '1rem' }} /> {/* Tailwind destructive red */}
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'hsl(var(--foreground))', marginBottom: '0.5rem' }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: '1.125rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem' }}>
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem' }}>
        Let's get you back on track.
      </p>
      <Button asChild size="lg">
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  );
}
