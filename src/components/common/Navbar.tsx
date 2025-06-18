
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Briefcase, Bell, Settings, LogOut, UserPlus, ShieldCheck, FileText, UserCircle2, Ticket, Users, FileSpreadsheet, BarChart3, UserSquare2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import type { User, Supervisor } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import LTLogo from './LTLogo';

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
    setIsOpen(false);
    router.push('/');
  };

  const commonAuthenticatedNavItemsBase = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <Briefcase className="w-4 h-4" /> },
  ];

  const employeeNavItems = [
    ...commonAuthenticatedNavItemsBase,
    { href: '/tickets/new', label: 'Create Ticket', icon: <Ticket className="w-4 h-4" /> },
    { href: '/employee/tickets', label: 'My Tickets', icon: <FileText className="w-4 h-4" /> },
    { href: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  // Base for all supervisors
  const supervisorBaseNavItems = [
    ...commonAuthenticatedNavItemsBase,
    { href: '/supervisor/tickets', label: 'Ticket Management', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { href: '/reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { href: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  // Specific to DH and IC Head
  const adminManagementNavItems = [
     { href: '/admin/add-employee', label: 'Manage Employees', icon: <Users className="w-4 h-4" /> },
     { href: '/admin/add-supervisor', label: 'Manage Supervisors', icon: <UserSquare2 className="w-4 h-4" /> },
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
        { href: '/employee/tickets', label: 'My Tickets'},
      ];
    } else { // IS, NS, DH, IC Head
      const supervisorUser = user as Supervisor;
      navItemsToDisplay = [...supervisorBaseNavItems];
      desktopNavItemsToDisplay = [
        { href: '/', label: 'Home'},
        { href: '/dashboard', label: 'Dashboard'},
        { href: '/supervisor/tickets', label: 'Tickets'},
        { href: '/reports', label: 'Reports'},
      ];
      if (supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head') {
        navItemsToDisplay.push(...adminManagementNavItems);
        desktopNavItemsToDisplay.push(...adminManagementNavItems.map(item => ({href: item.href, label: item.label.replace("Manage ", "")})));
      }
    }
  }


  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-neutral-200 dark:bg-neutral-700 rounded-sm animate-pulse"></div>
            <span className="font-bold font-headline text-xl">L&T Helpdesk</span>
          </Link>
          <div className="flex items-center space-x-2">
             <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse"></div>
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
          <LTLogo className="h-7 w-7 text-primary" />
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
  const mainDesktopLabels = ['Home', 'Dashboard', 'Create Ticket', 'My Tickets', 'Tickets', 'Reports', 'Employees', 'Supervisors'];
  const supervisorUser = user as Supervisor;

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
              {user.psn.toString()} ({user.role === 'Employee' ? 'Employee' : `${supervisorUser.title} - ${supervisorUser.functionalRole}`})
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {navItemsForDropdown.filter(item => !mainDesktopLabels.includes(item.label) && !mainDesktopLabels.includes(item.label.replace("Manage ",""))).map(item => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="flex items-center">
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}

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
