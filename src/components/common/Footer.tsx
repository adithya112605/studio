// src/components/common/Footer.tsx
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Facebook, Twitter, Linkedin, Globe, Briefcase, Users, TrendingUp, MapPin, Phone, Mail, Shield } from 'lucide-react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const portalLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Employee Portal' }, // Assuming dashboard is the employee portal
    { href: '/tickets/new', label: 'Create Ticket' },
    { href: '/hr/tickets', label: 'HR Dashboard' },    // Assuming hr/tickets is the HR dashboard
    { href: '/admin/add-employee', label: 'Admin Portal' } // Example link for Admin Portal
  ];

  const officialLinks = [
    { href: 'https://www.larsentoubro.com/', label: 'Main Website', icon: <Globe className="w-4 h-4 mr-2 inline-block" /> },
    { href: 'https://www.larsentoubro.com/corporate/about-lt/', label: 'Business Overview', icon: <Briefcase className="w-4 h-4 mr-2 inline-block" /> },
    { href: 'https://www.larsentoubro.com/corporate/careers/', label: 'Careers', icon: <Users className="w-4 h-4 mr-2 inline-block" /> },
    { href: 'https://investors.larsentoubro.com/', label: 'Investors', icon: <TrendingUp className="w-4 h-4 mr-2 inline-block" /> }
  ];

  const supportContacts = [
    { text: 'L&T House, Ballard Estate, Mumbai', icon: <MapPin className="w-4 h-4 mr-2 inline-block" />, href: "https://www.google.com/maps/search/?api=1&query=L%26T+House,+Ballard+Estate,+Mumbai" },
    { text: '+91 22 6752 5000', icon: <Phone className="w-4 h-4 mr-2 inline-block" />, href: "tel:+912267525000" },
    { text: 'hr.support@lntecc.com', icon: <Mail className="w-4 h-4 mr-2 inline-block" />, href: "mailto:hr.support@lntecc.com" }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {/* Column 1: L&T Construction */}
          <div>
            <div className="flex items-center justify-center mb-3">
              <Building className="w-8 h-8 text-primary mr-2" />
              <h5 className="font-headline text-xl font-semibold text-slate-100">L&T Construction</h5>
            </div>
            <p className="text-sm text-primary mb-3">Building Excellence</p>
            <p className="text-xs mb-4 leading-relaxed">
              Leading construction company committed to delivering world-class
              infrastructure and providing exceptional employee support through our
              advanced support portal.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="https://facebook.com/larsentoubro" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary">
                <Facebook size={18} /> <span className="sr-only">Facebook</span>
              </a>
              <a href="https://twitter.com/larsentoubro" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary">
                <Twitter size={18} /> <span className="sr-only">Twitter</span>
              </a>
              <a href="https://linkedin.com/company/larsen---toubro" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary">
                <Linkedin size={18} /> <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Column 2: Portal */}
          <div>
            <h5 className="font-headline text-lg font-semibold text-primary mb-4">Portal</h5>
            <ul className="space-y-2 text-sm">
              {portalLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-slate-100 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: L&T Official */}
          <div>
            <h5 className="font-headline text-lg font-semibold text-primary mb-4">L&T Official</h5>
            <ul className="space-y-2 text-sm">
              {officialLinks.map(link => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-100 transition-colors items-center inline-flex">
                    {link.icon}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h5 className="font-headline text-lg font-semibold text-primary mb-4">Support</h5>
            <ul className="space-y-2 text-sm">
              {supportContacts.map(contact => (
                 <li key={contact.text}>
                  <a href={contact.href} target={contact.href.startsWith('mailto:') || contact.href.startsWith('tel:') ? '_self' : '_blank'} rel="noopener noreferrer" className="text-slate-400 hover:text-slate-100 transition-colors items-center inline-flex">
                    {contact.icon}
                    {contact.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-12 pt-8 text-xs">
          <div className="flex flex-col md:flex-row justify-between items-center text-center">
            <p className="mb-2 md:mb-0">
              &copy; {currentYear || new Date().getFullYear()} Larsen & Toubro Limited. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/privacy-policy" className="text-slate-400 hover:text-slate-100 transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-slate-400 hover:text-slate-100 transition-colors">Terms of Service</Link>
              <Link href="/auth/signin?role=admin" className="text-slate-400 hover:text-slate-100 transition-colors items-center inline-flex">
                <Shield size={14} className="mr-1"/>Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
