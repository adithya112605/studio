"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Briefcase, Bell, Settings, LogOut, UserPlus, ShieldCheck, FileText, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    ...(user ? [
      { href: '/dashboard', label: 'Dashboard', icon: <Briefcase className="w-4 h-4" /> },
      ...(user.role === 'Employee' ? [
        { href: '/tickets/new', label: 'New Ticket', icon: <UserPlus className="w-4 h-4" /> },
      ] : []),
      ...(user.role === 'HR' || user.role === 'Head HR' ? [
        { href: '/reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
        { href: '/admin/add-employee', label: 'Add Employee', icon: <UserPlus className="w-4 h-4" /> },
        { href: '/admin/add-hr', label: 'Add HR', icon: <ShieldCheck className="w-4 h-4" /> },
      ] : []),
      { href: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
      { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ] : [
      { href: '/auth/signin', label: 'Sign In' },
      { href: '/auth/signup', label: 'Sign Up' },
    ]),
  ];

  if (!isMounted) {
    return ( // Return a placeholder or null during server rendering / hydration
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-xl">L&T Helpdesk</span>
          </Link>
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div> {/* Placeholder for ThemeToggle */}
             <div className="w-8 h-8 bg-muted rounded-full animate-pulse md:hidden"></div> {/* Placeholder for Menu button */}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          {/* L&T Logo - using a placeholder for now */}
          {/* <Image src="/lt-logo.png" alt="L&T Logo" width={32} height={32} /> */}
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-xl">L&T Helpdesk</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.filter(item => !item.icon).map((item) => ( // Show only non-authed links in main nav
            <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {user && (
             <div className="hidden md:flex items-center space-x-2">
              <Link href="/notifications" aria-label="Notifications">
                <Button variant="ghost" size="icon"><Bell className="w-5 h-5"/></Button>
              </Link>
              <Link href="/settings" aria-label="Settings">
                 <Button variant="ghost" size="icon"><Settings className="w-5 h-5"/></Button>
              </Link>
              <DropdownMenuUser user={user} logout={logout} />
             </div>
          )}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Open menu">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg p-4 border-t border-border/40">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground" onClick={toggleMenu}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            {user && (
              <Button variant="ghost" onClick={() => { logout(); toggleMenu(); }} className="flex items-center space-x-2 p-2 rounded-md hover:bg-destructive hover:text-destructive-foreground w-full justify-start">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from '@/types'; // Ensure User type is defined

const DropdownMenuUser = ({ user, logout }: { user: User; logout: () => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserCircle2 className="h-8 w-8 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.psn}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export default Navbar;
