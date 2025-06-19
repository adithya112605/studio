
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Linkedin, Twitter, Building, Globe, FileText, Users, Briefcase, MapPin, Phone, Mail, BookOpenText, Leaf, Megaphone, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'; // Import cn utility

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | string>('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  

  const lntConstructionLinks = [
    { href: 'https://facebook.com/larsentoubro', label: 'Facebook', icon: <Facebook size={20} /> },
    { href: 'https://twitter.com/larsentoubro', label: 'Twitter', icon: <Twitter size={20} /> },
    { href: 'https://linkedin.com/company/larsen---toubro', label: 'LinkedIn', icon: <Linkedin size={20} /> },
  ];

  const portalLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Employee Portal' },
    { href: '/tickets/new', label: 'Create Ticket' },
    { href: '/hr/tickets', label: 'HR Dashboard' },
    { href: '/admin/add-employee', label: 'Admin Portal' },
  ];

  const ltOfficialLinks = [
    { href: 'https://www.larsentoubro.com', label: 'Main Website', icon: <Globe size={18} className="mr-2 flex-shrink-0" />, target: "_blank" },
    { href: 'https://www.larsentoubro.com/corporate/about-lt/company-overview/', label: 'Business Overview', icon: <FileText size={18} className="mr-2 flex-shrink-0" />, target: "_blank" },
    { href: 'https://www.larsentoubro.com/corporate/careers/', label: 'Careers', icon: <Users size={18} className="mr-2 flex-shrink-0" />, target: "_blank" },
    { href: 'https://investors.larsentoubro.com', label: 'Investors', icon: <Briefcase size={18} className="mr-2 flex-shrink-0" />, target: "_blank" },
  ];
  
  const resourcesLinks = [
    { href: 'https://investors.larsentoubro.com/annual-reports.aspx', label: 'Annual Reports', icon: <BookOpenText size={18} className="mr-2 flex-shrink-0" />, target: "_blank" },
    { href: 'https://www.larsentoubro.com/corporate/sustainability/overview/', label: 'Sustainability Initiatives', icon: <Leaf size={18} className="mr-2 flex-shrink-0" />, target: "_blank" },
    { href: 'https://www.larsentoubro.com/corporate/media/press-releases/', label: 'Media Center', icon: <Megaphone size={18} className="mr-2 flex-shrink-0" />, target: "_blank" },
    { href: 'https://www.larsentoubro.com/corporate/media/lt-ites-magazine/', label: 'L&T-ites Magazine', icon: <Newspaper size={18} className="mr-2 flex-shrink-0" />, target: "_blank" },
  ];

  const supportContacts = [
    { text: 'L&T House, Ballard Estate, P.O. Box: 278, Mumbai 400 001, India', icon: <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />, href: 'https://www.google.com/maps/search/?api=1&query=L%26T+House%2C+Ballard+Estate%2C+Mumbai' },
    { text: '+91 22 6752 5656', icon: <Phone size={18} className="mr-2 mt-1 flex-shrink-0" />, href: 'tel:+912267525656' },
    { text: 'hr.support@larsentoubro.com', icon: <Mail size={18} className="mr-2 mt-1 flex-shrink-0" />, href: 'mailto:hr.support@larsentoubro.com' },
  ];


  return (
    <footer className="bg-card text-card-foreground border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-1">
              <Building className="h-7 w-7 text-primary" />
              <span className="font-bold font-headline text-xl text-foreground">L&T Construction</span>
            </div>
            <p className="text-sm text-primary font-medium">Building Excellence</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Leading construction company committed to delivering world-class infrastructure and providing exceptional employee support through our advanced support portal.
            </p>
            <div className="flex space-x-3 pt-2">
              {lntConstructionLinks.map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label={link.label}>
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="font-headline text-lg font-semibold text-primary text-center md:text-left mb-3">Portal</h5>
            <ul className="space-y-2 text-sm text-center md:text-left">
              {portalLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

           <div className="space-y-4">
            <h5 className="font-headline text-lg font-semibold text-primary text-center md:text-left mb-3">L&T Official</h5>
            <ul className="space-y-2 text-sm text-center md:text-left">
              {ltOfficialLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} target={link.target || "_self"} className="flex items-center text-muted-foreground hover:text-primary transition-colors group justify-center md:justify-start">
                    {React.cloneElement(link.icon, { className: cn(link.icon.props.className, "text-muted-foreground group-hover:text-primary transition-colors") })}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-headline text-lg font-semibold text-primary text-center md:text-left mb-3">Resources</h5>
            <ul className="space-y-2 text-sm text-center md:text-left">
              {resourcesLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} target={link.target || "_self"} className="flex items-center text-muted-foreground hover:text-primary transition-colors group justify-center md:justify-start">
                     {React.cloneElement(link.icon, { className: cn(link.icon.props.className, "text-muted-foreground group-hover:text-primary transition-colors") })}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:col-span-2 lg:col-span-1 lg:col-start-4 xl:col-start-auto"> 
            <h5 className="font-headline text-lg font-semibold text-primary text-center md:text-left mb-3">Support</h5>
            <ul className="space-y-2 text-sm text-center md:text-left">
              {supportContacts.map(contact => (
                <li key={contact.text}>
                  <a href={contact.href} target={contact.href.startsWith('tel:') || contact.href.startsWith('mailto:') ? '_self' : '_blank'} rel="noopener noreferrer" className="flex items-start text-muted-foreground hover:text-primary transition-colors group justify-center md:justify-start">
                    {React.cloneElement(contact.icon, { className: cn(contact.icon.props.className, "text-muted-foreground group-hover:text-primary transition-colors") })}
                    <span>{contact.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-y-4">
            <p className="text-muted-foreground text-center md:text-left">
              &copy; {currentYear} Larsen & Toubro Limited. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                 <Link href="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link> 
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
