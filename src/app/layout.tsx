
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import CookieConsentBanner from '@/components/common/CookieConsentBanner'; 
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'L&T Helpdesk',
  description: 'L&T Internal Ticketing System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark" 
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-grow"> 
              {children}
            </main>
            <Footer />
            <CookieConsentBanner /> 
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="lazyOnload" />
        <Script src="https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.net.min.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
