
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Linkedin, Shield, FileText, Server, Users, Info } from 'lucide-react';
import LTLogo from './LTLogo'; // Assuming LTLogo is adapted for the new theme
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | string>('');
  const { toast } = useToast();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const handleSubscription = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailInput = event.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (emailInput && emailInput.value) {
        toast({
            title: "Subscription (Simulated)",
            description: `Thank you for subscribing with ${emailInput.value}! (This is a demo, no email is sent).`,
        });
        emailInput.value = ''; // Clear input after mock submission
    } else {
        toast({
            title: "Subscription Error",
            description: "Please enter a valid email address.",
            variant: "destructive",
        });
    }
  };

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/tickets/new', label: 'Create Ticket' },
    { href: '/profile', label: 'My Profile' },
  ];

  const companyLinks = [
    { href: 'https://www.larsentoubro.com/corporate/about-lt/', label: 'About L&T', target: "_blank" },
    { href: '/#features', label: 'Our Features' },
    { href: 'https://www.larsentoubro.com/corporate/careers/', label: 'Careers at L&T', target: "_blank" },
  ];
  
  const supportLinks = [
    { href: '/#contact', label: 'Contact Support' },
    { href: '/faq', label: 'FAQ (Placeholder)' }, // Placeholder
    { href: '/settings', label: 'Account Settings' },
  ];

  return (
    <footer className="bg-card text-card-foreground border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: About & Logo */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 mb-2">
              <LTLogo className="h-10 w-10" />
              <span className="font-bold font-headline text-2xl text-foreground">L&T Helpdesk</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Streamlining internal support for Larsen & Toubro. Efficient, reliable, and tailored for our employees' needs.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h5 className="font-headline text-lg font-semibold text-foreground mb-3">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
           <div className="space-y-4">
            <h5 className="font-headline text-lg font-semibold text-foreground mb-3">Company</h5>
            <ul className="space-y-2 text-sm">
              {companyLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} target={link.target || "_self"} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Subscribe */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <h5 className="font-headline text-lg font-semibold text-foreground mb-3">Stay Updated</h5>
            <p className="text-sm text-muted-foreground mb-3">
              Get occasional updates about the helpdesk system.
            </p>
            <form className="flex space-x-2" onSubmit={handleSubscription}>
              <Input type="email" name="email" placeholder="Enter your email" className="bg-input border-border text-foreground placeholder:text-muted-foreground flex-grow" />
              <Button type="submit" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-8 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-center md:text-left">
              &copy; {currentYear} Larsen & Toubro Limited. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                 <Link href="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link> 
            </div>
            <div className="flex space-x-4">
              <a href="https://facebook.com/larsentoubro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com/larsentoubro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com/company/larsen---toubro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://youtube.com/user/LarsenToubro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
