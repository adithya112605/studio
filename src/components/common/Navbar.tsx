
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Briefcase, Bell, Settings, LogOut, UserPlus, ShieldCheck, FileText, UserCircle2, Ticket, Users, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image'; // Kept for future logo
import type { User } from '@/types'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

  const commonAuthenticatedNavItems = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <Briefcase className="w-4 h-4" /> },
  ];

  const employeeNavItems = [
    ...commonAuthenticatedNavItems,
    { href: '/tickets/new', label: 'Create Ticket', icon: <Ticket className="w-4 h-4" /> },
    { href: '/dashboard', label: 'My Tickets', icon: <FileText className="w-4 h-4" /> }, // Links to dashboard as it shows user's tickets
    { href: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const hrNavItems = [
    ...commonAuthenticatedNavItems,
    { href: '/admin/add-employee', label: 'Manage Employee', icon: <Users className="w-4 h-4" /> }, // Add Employee can be part of "Manage"
    { href: '/dashboard', label: 'Ticket Management', icon: <FileSpreadsheet className="w-4 h-4" /> }, // Links to dashboard
    { href: '/reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { href: '/admin/add-hr', label: 'Add HR', icon: <ShieldCheck className="w-4 h-4" /> },
    { href: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];
  
  const unauthenticatedNavItems = [
    { href: '/auth/signin', label: 'Sign In' },
    { href: '/auth/signup', label: 'Sign Up' },
  ];

  let navItemsToDisplay = unauthenticatedNavItems;
  if (user) {
    if (user.role === 'Employee') {
      navItemsToDisplay = employeeNavItems;
    } else if (user.role === 'HR' || user.role === 'Head HR') {
      navItemsToDisplay = hrNavItems;
    }
  }


  if (!isMounted) {
    return ( 
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-xl">L&T Helpdesk</span>
          </Link>
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div> 
             <div className="w-8 h-8 bg-muted rounded-full animate-pulse md:hidden"></div> 
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          {/* <Image src="/lt-logo.png" alt="L&T Logo" width={32} height={32} /> Placeholder for actual logo */}
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-xl">L&T Helpdesk</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {user ? (
            // Desktop links for authenticated users (icons usually in dropdown or minimal)
            navItemsToDisplay.filter(item => ['Home', 'Dashboard'].includes(item.label) || (item.label === 'Create Ticket' && user.role === 'Employee') || (item.label === 'Reports' && (user.role === 'HR' || user.role === 'Head HR'))).map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary flex items-center gap-1">
                {/* Minimal icons for desktop main nav if desired, or text only */}
                {/* {item.icon}  */}
                {item.label}
              </Link>
            ))
          ) : (
            unauthenticatedNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))
          )}
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {user && (
             <div className="hidden md:flex items-center space-x-2">
              <Link href="/notifications" aria-label="Notifications">
                <Button variant="ghost" size="icon"><Bell className="w-5 h-5"/></Button>
              </Link>
              <DropdownMenuUser user={user} logout={logout} navItems={navItemsToDisplay} />
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
            {navItemsToDisplay.map((item) => (
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
            {!user && unauthenticatedNavItems.map(item => (
                 <Link key={item.href} href={item.href} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground" onClick={toggleMenu}>
                    <span>{item.label}</span>
                 </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};


const DropdownMenuUser = ({ user, logout, navItems }: { user: User; logout: () => void; navItems: Array<{href:string; label:string; icon?:React.ReactNode}> }) => {
  const settingsItem = navItems.find(item => item.label === 'Settings');
  const addEmployeeItem = navItems.find(item => item.label === 'Manage Employee'); // Assuming 'Manage Employee' maps to 'Add Employee' logic for HR
  const addHrItem = navItems.find(item => item.label === 'Add HR');


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
              {user.psn} ({user.role})
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Dynamically add items relevant from navItems, avoiding duplicates if already in main nav */}
        {navItems.filter(item => !['Home', 'Dashboard'].includes(item.label)).map(item => (
          (item.label === 'Reports' && (user.role !== 'HR' && user.role !== 'Head HR')) ? null : // Hide reports for employee in dropdown
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="flex items-center">
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        
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
