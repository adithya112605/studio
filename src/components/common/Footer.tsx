
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Facebook, Twitter, Linkedin, Globe, Briefcase, Users, TrendingUp, MapPin, Phone, Mail, Shield, Instagram, MessageSquare, Archive, Newspaper, BookOpen } from 'lucide-react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const portalLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Employee Portal' },
    { href: '/tickets/new', label: 'Create Ticket' },
    { href: '/hr/tickets', label: 'HR Dashboard' },
    { href: '/admin/add-employee', label: 'Admin Portal' }
  ];

  const officialLinks = [
    { href: 'https://www.larsentoubro.com/', label: 'Main Website', icon: <Globe className="w-4 h-4 mr-2 flex-shrink-0" /> },
    { href: 'https://www.larsentoubro.com/corporate/about-lt/', label: 'Business Overview', icon: <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" /> },
    { href: 'https://www.larsentoubro.com/corporate/careers/', label: 'Careers', icon: <Users className="w-4 h-4 mr-2 flex-shrink-0" /> },
    { href: 'https://investors.larsentoubro.com/', label: 'Investors', icon: <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" /> }
  ];

  const supportContacts = [
    { text: 'L&T House, Ballard Estate, Mumbai', icon: <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />, href: "https://www.google.com/maps/search/?api=1&query=L%26T+House,+Ballard+Estate,+Mumbai" },
    { text: '+91 22 6752 5000', icon: <Phone className="w-4 h-4 mr-2 flex-shrink-0" />, href: "tel:+912267525000" },
    { text: 'hr.support@lntecc.com', icon: <Mail className="w-4 h-4 mr-2 flex-shrink-0" />, href: "mailto:hr.support@lntecc.com" }
  ];

  const resourceLinks = [
    { href: '#annual-reports', label: 'Annual Reports', icon: <Archive className="w-4 h-4 mr-2 flex-shrink-0" /> },
    { href: '#sustainability', label: 'Sustainability', icon: <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" /> },
    { href: '#media-center', label: 'Media Center', icon: <Newspaper className="w-4 h-4 mr-2 flex-shrink-0" /> },
    { href: '#lt-magazine', label: 'L&T-ites Magazine', icon: <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" /> }
  ];


  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Column 1: L&T Construction */}
          <div className="lg:col-span-1 md:col-span-3 sm:col-span-2 text-left"> {/* Changed to text-left */}
            <div className="flex items-center mb-3">
              <Building className="w-8 h-8 text-primary mr-2 flex-shrink-0" />
              <h5 className="font-headline text-xl font-semibold text-slate-100">L&T Construction</h5>
            </div>
            <p className="text-sm text-primary mb-3">Building Excellence</p>
            <p className="text-xs mb-4 leading-relaxed">
              Leading construction company committed to delivering world-class
              infrastructure and providing exceptional employee support through our
              advanced support portal.
            </p>
          </div>

          {/* Column 2: Portal */}
          <div className="text-left"> {/* Centered heading, left-aligned links */}
            <h5 className="font-headline text-lg font-semibold text-primary mb-4 text-center sm:text-left">Portal</h5>
            <ul className="space-y-2 text-sm text-center sm:text-left">
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
          <div className="text-left">
            <h5 className="font-headline text-lg font-semibold text-primary mb-4 text-center sm:text-left">L&T Official</h5>
            <ul className="space-y-2 text-sm text-center sm:text-left">
              {officialLinks.map(link => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-100 transition-colors inline-flex items-center">
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="text-left">
            <h5 className="font-headline text-lg font-semibold text-primary mb-4 text-center sm:text-left">Resources</h5>
            <ul className="space-y-2 text-sm text-center sm:text-left">
              {resourceLinks.map(link => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-100 transition-colors inline-flex items-center">
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 5: Support */}
          <div className="text-left">
            <h5 className="font-headline text-lg font-semibold text-primary mb-4 text-center sm:text-left">Support</h5>
            <ul className="space-y-2 text-sm text-center sm:text-left">
              {supportContacts.map(contact => (
                 <li key={contact.text}>
                  <a href={contact.href} target={contact.href.startsWith('mailto:') || contact.href.startsWith('tel:') ? '_self' : '_blank'} rel="noopener noreferrer" className="text-slate-400 hover:text-slate-100 transition-colors inline-flex items-center">
                    {contact.icon}
                    <span>{contact.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-12 pt-8 text-xs text-center">
          <div className="flex justify-center space-x-6 mb-4">
              <a href="https://facebook.com/larsentoubro" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com/larsentoubro" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#skype-placeholder" className="text-slate-400 hover:text-primary" aria-label="Skype"> {/* Placeholder for Skype */}
                <MessageSquare size={20} />
              </a>
            </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-2 md:mb-0">
              &copy; {currentYear || new Date().getFullYear()} Larsen & Toubro Limited. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/privacy-policy" className="text-slate-400 hover:text-slate-100 transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-slate-400 hover:text-slate-100 transition-colors">Terms of Service</Link>
              <Link href="/auth/signin?role=admin" className="text-slate-400 hover:text-slate-100 transition-colors inline-flex items-center">
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
