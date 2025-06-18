
"use client"; // Keep if you plan to add client-side interactions later, otherwise can be removed for pure static.

// Minimal imports for now, or remove if Link and Button are not used in this ultra-simple version.
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 10rem)', // Adjust as needed based on your header/footer height
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'sans-serif', // Basic font
        backgroundColor: '#1f2937', // A dark background similar to the screenshot
        color: '#f3f4f6', // Light text color
      }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#dc2626" // Red color for icon
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        style={{ marginBottom: '1rem' }}
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.5rem' }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#d1d5db', marginBottom: '1.5rem' }}>
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
        Let's get you back on track.
      </p>
      <a 
        href="/" 
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: '500',
          color: '#ffffff',
          backgroundColor: '#3b82f6', // Blue button
          borderRadius: '0.375rem',
          textDecoration: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        Go to Homepage
      </a>
    </div>
  );
}
