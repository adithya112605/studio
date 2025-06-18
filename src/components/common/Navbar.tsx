
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Briefcase, Bell, Settings, LogOut, UserPlus, ShieldCheck, FileText, UserCircle2, Ticket, Users, FileSpreadsheet, BarChart3 } from 'lucide-react'; 
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
import { useRouter } from 'next/navigation';
import LTLogo from './LTLogo'; // Import the new LTLogo component

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close mobile menu if open
    router.push('/'); // Redirect to homepage after logout
  };

  const commonAuthenticatedNavItemsBase = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <Briefcase className="w-4 h-4" /> },
  ];

  const employeeNavItems = [
    ...commonAuthenticatedNavItemsBase,
    { href: '/tickets/new', label: 'Create Ticket', icon: <Ticket className="w-4 h-4" /> },
    { href: '/dashboard', label: 'My Tickets', icon: <FileText className="w-4 h-4" /> }, 
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
  
  const headHrNavItems = [
    ...hrNavItems, 
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
            <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-sm animate-pulse"></div> {/* Placeholder for logo */}
            <span className="font-bold font-headline text-xl">L&T Helpdesk</span>
          </Link>
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div> 
             <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse md:hidden"></div> 
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <LTLogo className="h-7 w-7 text-primary" /> {/* Using the new LTLogo component */}
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
          {user ? (
             <div className="flex items-center space-x-2">
              <Link href="/notifications" aria-label="Notifications" className="hidden md:inline-flex">
                <Button variant="ghost" size="icon"><Bell className="w-5 h-5"/></Button>
              </Link>
              <DropdownMenuUser user={user} logout={handleLogout} navItemsForDropdown={navItemsToDisplay} />
              <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:inline-flex">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
             </div>
          ) : (
             <div className="hidden md:flex items-center space-x-2">
              <Button asChild variant="default" size="sm"><Link href="/auth/signin">Sign In</Link></Button>
              <Button asChild variant="outline" size="sm"><Link href="/auth/signup">Sign Up</Link></Button>
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
              <Button variant="ghost" onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded-md hover:bg-destructive hover:text-destructive-foreground w-full justify-start">
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
  const mainDesktopLabels = ['Home', 'Dashboard', 'Create Ticket', 'Reports']; 

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
              {user.psn.toString()} ({user.role}) 
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {navItemsForDropdown.filter(item => !mainDesktopLabels.includes(item.label) && item.label !== 'Home' && item.label !== 'Dashboard' ).map(item => (
          (item.label === 'Reports' && user.role === 'Employee') ? null : 
          (item.label === 'Manage HR' && user.role !== 'Head HR') ? null : 
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="flex items-center">
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        {/* Settings is usually always good in dropdown, ensure it's not duplicated if it's in navItemsForDropdown and also not a mainDesktopLabel */}
        {!navItemsForDropdown.some(item => item.label === 'Settings' && !mainDesktopLabels.includes(item.label)) && (
            <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </Link>
            </DropdownMenuItem>
        )}
        
        {/* Logout specific for desktop dropdown menu, if not covered by main button */}
        <DropdownMenuSeparator className="md:hidden" /> 
        <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive md:hidden">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Navbar;
