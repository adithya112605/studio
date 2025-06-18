
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Briefcase, Bell, Settings, LogOut, UserPlus, ShieldCheck, FileText, UserCircle2, Ticket, Users, FileSpreadsheet, BarChart3, UserSquare2, Eye, LogIn } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const supervisorBaseNavItems = [
    ...commonAuthenticatedNavItemsBase,
    { href: '/hr/tickets', label: 'Ticket Management', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { href: '/supervisor/employee-details', label: 'Employee Details', icon: <Eye className="w-4 h-4" /> },
    { href: '/reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { href: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

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
        { href: '/dashboard', label: 'Dashboard'},
        { href: '/tickets/new', label: 'Create Ticket'},
        { href: '/employee/tickets', label: 'My Tickets'},
      ];
    } else { 
      const supervisorUser = user as Supervisor;
      navItemsToDisplay = [...supervisorBaseNavItems]; 
      desktopNavItemsToDisplay = [ 
        { href: '/dashboard', label: 'Dashboard'},
        { href: '/hr/tickets', label: 'Tickets'},
        { href: '/supervisor/employee-details', label: 'Employees'},
        { href: '/reports', label: 'Reports'},
      ];
      if (supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head') {
        navItemsToDisplay.push(...adminManagementNavItems); 
        // Admin management links typically go into a user dropdown or a separate admin section
      }
    }
  }


  if (!isMounted) {
    // Skeleton loader for Navbar
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-muted rounded-sm animate-pulse"></div>
            <div className="w-32 h-6 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
             <div className="w-10 h-10 bg-muted rounded-md animate-pulse"></div> {/* Theme toggle */}
             <div className="w-20 h-9 bg-muted rounded-md animate-pulse md:hidden"></div> {/* Hamburger or User icon */}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled 
          ? "border-border bg-background shadow-md" 
          : "border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}>
      <div className={cn(
          "container flex max-w-screen-2xl items-center transition-all duration-300",
          isScrolled ? "h-14" : "h-16"
        )}>

        {/* Left Section: Logo & Title */}
        <Link href="/" className="flex items-center space-x-2 mr-auto md:mr-6 shrink-0">
          <LTLogo className="h-7 w-7 text-primary" />
          <span className="font-bold font-headline text-xl hidden sm:inline">L&T Helpdesk</span>
        </Link>

        {/* Center Section (Desktop Nav Links for Authenticated Users) */}
        {user && (
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium absolute left-1/2 transform -translate-x-1/2">
            {desktopNavItemsToDisplay.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary px-1 py-1">
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        
        <div className="flex items-center space-x-2 md:space-x-3 ml-auto">
          <ThemeToggle />
          {user ? (
             <div className="flex items-center space-x-2 md:space-x-3">
              <Link href="/notifications" aria-label="Notifications" className="hidden md:inline-flex">
                <Button variant="ghost" size="icon"><Bell className="w-5 h-5"/></Button>
              </Link>
              <DropdownMenuUser user={user} logout={handleLogout} navItemsForDropdown={navItemsToDisplay} adminManagementNavItems={adminManagementNavItems} />
              <Button variant="outline" size="sm" onClick={handleLogout} className="hidden lg:inline-flex">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
             </div>
          ) : (
             <div className="hidden md:flex items-center space-x-2">
              <Button asChild variant="default" size="default" className="font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-primary/90 transition-all text-sm">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="default" className="px-5 py-2.5 rounded-lg shadow-sm hover:bg-accent/50 transition-all text-sm">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
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
        <div className="md:hidden fixed inset-x-0 top-14 sm:top-16 z-40 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-background/95 backdrop-blur-sm p-6 pt-4 border-t border-border/40 animate-in slide-in-from-top-full duration-300">
          <nav className="flex flex-col space-y-2">
            {navItemsToDisplay.map((item) => {
              let iconToDisplay = item.icon ? React.cloneElement(item.icon, { className: "w-5 h-5 text-muted-foreground group-hover:text-accent-foreground" }) : null;
              if (!user) { 
                if (item.href === '/auth/signin') iconToDisplay = <LogIn className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground" />;
                if (item.href === '/auth/signup') iconToDisplay = <UserPlus className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground" />;
              }
              if (!iconToDisplay && user) iconToDisplay = <div className="w-5 h-5 shrink-0"></div>; 

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground text-base font-medium transition-colors"
                  onClick={toggleMenu}
                >
                  {iconToDisplay}
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {user && ( 
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-destructive hover:text-destructive-foreground w-full justify-start text-base font-medium transition-colors mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};


const DropdownMenuUser = ({ user, logout, navItemsForDropdown, adminManagementNavItems }: { 
    user: User; 
    logout: () => void; 
    navItemsForDropdown: Array<{href:string; label:string; icon?:React.ReactNode}>;
    adminManagementNavItems: Array<{href:string; label:string; icon?:React.ReactNode}>;
}) => {
  const mainDesktopLabels = ['Home', 'Dashboard', 'Create Ticket', 'My Tickets', 'Tickets', 'Reports', 'Employees', 'Ticket Management', 'Employee Details'];
  const supervisorUser = user as Supervisor;
  const showAdminItems = supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head';

  const dropdownSpecificItems = navItemsForDropdown.filter(item => 
    !mainDesktopLabels.includes(item.label) && 
    !mainDesktopLabels.includes(item.label.replace("Manage ","")) &&
    (item.label === 'Settings' || item.label === 'Notifications') 
  );


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full"> 
          <UserCircle2 className="h-7 w-7 text-muted-foreground" /> 
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" forceMount> 
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 py-1">
            <p className="text-sm font-semibold leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.psn.toString()}
            </p>
            <p className="text-xs leading-none text-muted-foreground pt-0.5">
              {user.role === 'Employee' ? 'Employee' : `${supervisorUser.title} (${supervisorUser.functionalRole})`}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {dropdownSpecificItems.map(item => (
          <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
            <Link href={item.href} className="flex items-center w-full">
              {item.icon ? React.cloneElement(item.icon, {className: "mr-2 h-4 w-4 text-muted-foreground"}) : <div className="mr-2 h-4 w-4"></div>}
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        
        {showAdminItems && adminManagementNavItems.length > 0 && <DropdownMenuSeparator />}
        {showAdminItems && adminManagementNavItems.map(item => (
             <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
             <Link href={item.href} className="flex items-center w-full">
               {item.icon ? React.cloneElement(item.icon, {className: "mr-2 h-4 w-4 text-muted-foreground"}) : <div className="mr-2 h-4 w-4"></div>}
               <span>{item.label}</span>
             </Link>
           </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive/90">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Navbar;
