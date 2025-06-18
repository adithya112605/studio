
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Briefcase, Bell, Settings, LogOut, UserPlus, ShieldCheck, FileText, UserCircle2, Ticket, Users, FileSpreadsheet, BarChart3 } from 'lucide-react'; // Added BarChart3 for Reports
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
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

  const commonAuthenticatedNavItemsBase = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <Briefcase className="w-4 h-4" /> },
  ];

  const employeeNavItems = [
    ...commonAuthenticatedNavItemsBase,
    { href: '/tickets/new', label: 'Create Ticket', icon: <Ticket className="w-4 h-4" /> },
    { href: '/dashboard', label: 'My Tickets', icon: <FileText className="w-4 h-4" /> }, // Links to dashboard as it shows user's tickets
    { href: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const hrNavItems = [
    ...commonAuthenticatedNavItemsBase,
    { href: '/admin/add-employee', label: 'Manage Employee', icon: <Users className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Ticket Management', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { href: '/reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { href: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];
  
  // Head HR gets all HR items plus potentially 'Add HR' if it's exclusive
  const headHrNavItems = [
    ...hrNavItems, // Includes everything from HR
    { href: '/admin/add-hr', label: 'Manage HR', icon: <ShieldCheck className="w-4 h-4" /> },
  ];


  const unauthenticatedNavItems = [
    { href: '/auth/signin', label: 'Sign In' },
    { href: '/auth/signup', label: 'Sign Up' },
  ];

  let navItemsToDisplay = unauthenticatedNavItems;
  let desktopNavItemsToDisplay: Array<{href:string; label:string; icon?:React.ReactNode}> = [];

  if (user) {
    if (user.role === 'Employee') {
      navItemsToDisplay = employeeNavItems;
      desktopNavItemsToDisplay = [
        { href: '/', label: 'Home'},
        { href: '/dashboard', label: 'Dashboard'},
        { href: '/tickets/new', label: 'Create Ticket'},
      ];
    } else if (user.role === 'HR') {
      navItemsToDisplay = hrNavItems;
      desktopNavItemsToDisplay = [
        { href: '/', label: 'Home'},
        { href: '/dashboard', label: 'Dashboard'},
        { href: '/reports', label: 'Reports'},
      ];
    } else if (user.role === 'Head HR') {
      navItemsToDisplay = headHrNavItems;
      desktopNavItemsToDisplay = [
        { href: '/', label: 'Home'},
        { href: '/dashboard', label: 'Dashboard'},
        { href: '/reports', label: 'Reports'},
      ];
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
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-xl">L&T Helpdesk</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {user ? (
            desktopNavItemsToDisplay.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
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
              <DropdownMenuUser user={user} logout={logout} navItemsForDropdown={navItemsToDisplay} />
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


const DropdownMenuUser = ({ user, logout, navItemsForDropdown }: { user: User; logout: () => void; navItemsForDropdown: Array<{href:string; label:string; icon?:React.ReactNode}> }) => {
  const mainDesktopLabels = ['Home', 'Dashboard', 'Create Ticket', 'Reports']; // Items already likely in main desktop nav

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
              {user.psn.toString()} ({user.role}) {/* psn to string for display */}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Dynamically add items relevant from navItems, avoiding duplicates if already in main nav */}
        {navItemsForDropdown.filter(item => !mainDesktopLabels.includes(item.label)).map(item => (
          // Special condition for reports if user is Employee (should not show up based on navItemsForDropdown logic already)
          (item.label === 'Reports' && user.role === 'Employee') ? null : 
          (item.label === 'Manage HR' && user.role !== 'Head HR') ? null : // Only Head HR sees Manage HR
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
