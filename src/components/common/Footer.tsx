// src/components/common/Footer.tsx
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Linkedin, Youtube, ArrowRight, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscription Simulated",
        description: `Thank you for subscribing with ${email}! (This is a demo, no email sent).`,
      });
      setEmail('');
    } else {
      toast({
        title: "Subscription Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  const partnerLogos = [
    { name: "Amazon", hint: "amazon logo" },
    { name: "McKesson", hint: "mckesson logo" },
    { name: "Johnson&Johnson", hint: "johnson johnson logo" },
    { name: "Dell", hint: "dell logo" },
    { name: "Merck", hint: "merck logo" },
  ];

  return (
    <footer className="bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Partner Logos Section */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-around items-center gap-8 md:gap-12">
            {partnerLogos.map(logo => (
              <div key={logo.name} className="text-center" data-ai-hint={logo.hint}>
                <p className="text-xl font-semibold text-muted-foreground opacity-70">{logo.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner Section */}
        <div className="bg-primary text-primary-foreground p-8 sm:p-12 md:p-16 rounded-xl shadow-2xl mb-16 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-3/5 space-y-6 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline">
                Contact Us for Assistance
              </h2>
              <p className="text-base sm:text-lg text-primary-foreground/80">
                Our experienced team is ready to help resolve your queries and provide support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-md px-8 py-3 rounded-lg">
                  Our Services
                </Button>
                <Button variant="link" size="lg" className="text-primary-foreground hover:text-primary-foreground/80 px-8 py-3 rounded-lg">
                  New Successes <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="lg:w-2/5 mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[28rem] lg:-mb-16 lg:-mr-8">
                <Image
                  src="https://placehold.co/320x448.png"
                  alt="Support Professional"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg shadow-xl"
                  data-ai-hint="professional woman smiling"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Link Sections & Subscribe Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Useful Links</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us-placeholder" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact-us-placeholder" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faqs-placeholder" className="text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.larsentoubro.com/corporate/products-services/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Products & Services</a></li>
              <li><a href="https://www.larsentoubro.com/corporate/media/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Press / Media</a></li>
              <li><a href="https://www.larsentoubro.com/corporate/careers/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
              <li><Link href="/support-placeholder" className="text-muted-foreground hover:text-primary transition-colors">Support</Link></li>
              <li><Link href="/help-center-placeholder" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Resources</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events-placeholder" className="text-muted-foreground hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="/community-placeholder" className="text-muted-foreground hover:text-primary transition-colors">Community</Link></li>
              <li><Link href="/social-media-placeholder" className="text-muted-foreground hover:text-primary transition-colors">Social Media</Link></li>
              <li><Link href="/newsletter-placeholder" className="text-muted-foreground hover:text-primary transition-colors">Newsletter</Link></li>
              <li><Link href="#subscribe-form" className="text-muted-foreground hover:text-primary transition-colors">Subscribe</Link></li>
            </ul>
          </div>
          <div id="subscribe-form">
            <h5 className="font-headline text-lg font-semibold mb-4">Subscribe</h5>
            <p className="text-sm text-muted-foreground mb-3">
              Join our community to receive updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-input border-border placeholder-muted-foreground/70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email for subscription"
              />
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              By subscribing, you agree to our <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" /> 
                <span className="font-headline text-2xl font-bold text-foreground">L&amp;T Helpdesk</span>
              </Link>
            </div>
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="https://facebook.com/larsentoubro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Facebook size={20} /> <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com/larsentoubro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} /> <span className="sr-only">Instagram</span>
              </a>
              <a href="https://linkedin.com/company/larsen---toubro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin size={20} /> <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://youtube.com/user/LarsenToubro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Youtube size={20} /> <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
            <div className="flex space-x-4 mb-2 md:mb-0">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy-placeholder" className="hover:text-primary transition-colors">Cookie Policy</Link>
            </div>
            <p>&copy; {currentYear || new Date().getFullYear()} Larsen &amp; Toubro Limited. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
