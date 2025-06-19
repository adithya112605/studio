
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const COOKIE_CONSENT_KEY = 'lnt_helpdesk_cookie_consent';

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentGiven) {
      // Delay showing the banner slightly to avoid immediate flash on load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-card border-t border-border shadow-2xl transition-transform duration-500 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="flex items-start md:items-center space-x-3">
          <Info className="h-6 w-6 text-primary flex-shrink-0 mt-1 md:mt-0" />
          <p className="text-sm text-card-foreground">
            This website uses cookies to ensure you get the best experience on our website. By continuing to use this site, you agree to our use of cookies.
          </p>
        </div>
        <div className="flex items-center space-x-3 md:space-x-4 flex-shrink-0 w-full md:w-auto">
          <Button
            onClick={handleAccept}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto px-6 py-2.5 rounded-full text-sm font-semibold"
            aria-label="Accept and close cookie banner"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Got it!
          </Button>
          <Button
            asChild
            variant="link"
            className="text-primary hover:underline p-0 h-auto text-sm w-full md:w-auto justify-center"
            aria-label="Learn more about our cookie policy"
          >
            <Link href="/cookie-policy">Learn more</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
