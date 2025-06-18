
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Facebook, Twitter, Linkedin, Globe, Building2, Users, Briefcase, MapPin, Phone, Mail, Shield } from 'lucide-react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* L&T Construction Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <span className="font-headline text-xl font-bold text-white">L&T Construction</span>
                <p className="text-xs text-slate-400">Building Excellence</p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Leading construction company committed to delivering world-class infrastructure and providing exceptional employee support through our advanced support portal.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Portal Links */}
          <div>
            <h5 className="font-headline text-lg font-semibold text-white mb-4">Portal</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Employee Portal</Link></li>
              <li><Link href="/tickets/new" className="hover:text-primary transition-colors">Create Ticket</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">HR Dashboard</Link></li>
              <li><Link href="/auth/signin?role=hr" className="hover:text-primary transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* L&T Official Links */}
          <div>
            <h5 className="font-headline text-lg font-semibold text-white mb-4">L&T Official</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.larsentoubro.com/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-primary transition-colors"><Globe size={16} /><span >Main Website</span></a></li>
              <li><a href="https://www.larsentoubro.com/corporate/about-us/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-primary transition-colors"><Building2 size={16} /><span>Business Overview</span></a></li>
              <li><a href="https://www.larsentoubro.com/corporate/careers/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-primary transition-colors"><Users size={16} /><span>Careers</span></a></li>
              <li><a href="https://investors.larsentoubro.com/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-primary transition-colors"><Briefcase size={16} /><span>Investors</span></a></li>
            </ul>
          </div>

          {/* Support Info */}
          <div>
            <h5 className="font-headline text-lg font-semibold text-white mb-4">Support</h5>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 shrink-0" />
                <span>L&T House, Ballard Estate, Mumbai</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="shrink-0" />
                <a href="tel:+912267525000" className="hover:text-primary transition-colors">+91 22 6752 5000</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="shrink-0" />
                <a href="mailto:hr.support@lntecc.com" className="hover:text-primary transition-colors">hr.support@lntecc.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>&copy; {currentYear || new Date().getFullYear()} Larsen & Toubro Limited. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/auth/signin?role=hr" className="flex items-center space-x-1 hover:text-primary transition-colors">
              <Shield size={12} />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
