
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Briefcase, Bell, Settings, LogOut, UserPlus, ShieldCheck, FileText, UserCircle2, Ticket, Users, FileSpreadsheet, BarChart3, UserSquare2, Eye, LogIn, UserCog, ChevronDown, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import type { User, Supervisor, Employee } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import LTLogo from './LTLogo';
import { cn } from '@/lib/utils';
import { mockEmployees } from '@/data/mockData'; // For deriving additional roles

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

  // Mobile navigation items (remains comprehensive)
  const commonAuthenticatedNavItemsBaseMobile = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <Briefcase className="w-4 h-4" /> },
    { href: '/profile', label: 'My Profile', icon: <UserCircle2 className="w-4 h-4" /> },
  ];
  const employeeNavItemsMobile = [
    ...commonAuthenticatedNavItemsBaseMobile,
    { href: '/tickets/new', label: 'Create Ticket', icon: <Ticket className="w-4 h-4" /> },
    { href: '/employee/tickets', label: 'My Tickets', icon: <FileText className="w-4 h-4" /> },
    { href: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];
  const supervisorBaseNavItemsMobile = [
    ...commonAuthenticatedNavItemsBaseMobile,
    { href: '/hr/tickets', label: 'Ticket Management', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { href: '/supervisor/employee-details', label: 'Employee Details', icon: <Eye className="w-4 h-4" /> },
    { href: '/reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { href: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];
  const adminManagementNavItemsMobile = [
     { href: '/admin/add-employee', label: 'Manage Employees', icon: <Users className="w-4 h-4" /> },
     { href: '/admin/add-supervisor', label: 'Manage Supervisors', icon: <UserSquare2 className="w-4 h-4" /> },
  ];
  const unauthenticatedNavItemsMobile = [
    { href: '/auth/signin', label: 'Sign In', icon: <LogIn className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground" /> },
    { href: '/auth/signup', label: 'Sign Up', icon: <UserPlus className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground" /> },
  ];

  let navItemsForMobile = unauthenticatedNavItemsMobile;
  if (user) {
    if (user.role === 'Employee') {
      navItemsForMobile = employeeNavItemsMobile;
    } else {
      navItemsForMobile = [...supervisorBaseNavItemsMobile];
      if ((user as Supervisor).functionalRole === 'DH' || (user as Supervisor).functionalRole === 'IC Head') {
        navItemsForMobile.push(...adminManagementNavItemsMobile);
      }
    }
  }

  // Desktop navigation items
  let desktopNavLinks: Array<{href:string; label:string; isDropdown?: boolean; subItems?: Array<{href:string; label:string; icon?: React.ReactNode}>}> = [];
  if (user) {
    desktopNavLinks.push({ href: '/dashboard', label: 'Dashboard'});
    if (user.role === 'Employee') {
      desktopNavLinks.push({ href: '/employee/tickets', label: 'My Tickets'});
      desktopNavLinks.push({ href: '/tickets/new', label: 'Create Ticket'});
    } else { // Supervisor roles
      const supervisorUser = user as Supervisor;
      desktopNavLinks.push({ href: '/hr/tickets', label: 'Ticket Mgt.'});
      desktopNavLinks.push({ href: '/supervisor/employee-details', label: 'Employees'});
      desktopNavLinks.push({ href: '/reports', label: 'Reports'});
      if (supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head') {
        desktopNavLinks.push({
          label: 'Admin',
          isDropdown: true,
          subItems: [
            { href: '/admin/add-employee', label: 'Add Employee', icon: <UserPlus className="mr-2 h-4 w-4"/> },
            { href: '/admin/add-supervisor', label: 'Add Supervisor', icon: <UserCog className="mr-2 h-4 w-4"/> },
            // Potentially add more admin links here
          ]
        });
      }
    }
  }


  if (!isMounted) {
    // Simplified skeleton for navbar to prevent layout shifts
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-muted rounded-md animate-pulse"></div>
            <div className="h-5 w-24 bg-muted rounded animate-pulse hidden sm:block"></div>
          </div>
          <div className="flex items-center space-x-2">
             <div className="h-8 w-8 bg-muted rounded-md animate-pulse"></div> {/* Theme Toggle */}
             <div className="h-8 w-20 bg-muted rounded-md animate-pulse hidden md:block"></div> {/* Sign In / User */}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        {/* Left: Logo + App Name */}
        <Link href="/" className="flex items-center space-x-2 mr-6 shrink-0">
          <LTLogo className="h-7 w-7" />
          <span className="font-bold font-headline text-lg hidden sm:inline-block">L&amp;T Helpdesk</span>
        </Link>

        {/* Center: Main Navigation Links (Desktop) */}
        {user && (
          <nav className="hidden md:flex flex-grow items-center space-x-1 lg:space-x-2 text-sm">
            {desktopNavLinks.map((item) =>
              item.isDropdown && item.subItems ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium h-8 text-xs">
                      {item.label} <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {item.subItems.map(subItem => (
                      <DropdownMenuItem key={subItem.href} asChild>
                        <Link href={subItem.href} className="flex items-center w-full">
                           {subItem.icon || <div className="mr-2 h-4 w-4"></div>}
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button key={item.href || item.label} variant="ghost" asChild className="px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium h-8 text-xs">
                  <Link href={item.href!}>{item.label}</Link>
                </Button>
              )
            )}
          </nav>
        )}
        {!user && <div className="flex-grow hidden md:block"></div>}


        {/* Right: Actions */}
        <div className="flex items-center space-x-1 md:space-x-2 ml-auto shrink-0">
          <ThemeToggle />
          {user ? (
             <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5">
                <Link href="/notifications" aria-label="Notifications"><Bell className="w-4 h-4"/></Link>
              </Button>
              <DropdownMenuUser user={user} logout={handleLogout} />
             </div>
          ) : (
             <div className="hidden md:flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-primary px-3 h-8 text-xs">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 h-8 text-xs">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Open menu" className="h-8 w-8">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-40 h-[calc(100vh-3.5rem)] bg-background/95 backdrop-blur-sm p-6 pt-4 border-t animate-in slide-in-from-top-full duration-300">
          <nav className="flex flex-col space-y-1">
            {navItemsForMobile.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground text-base font-medium transition-colors"
                  onClick={toggleMenu}
                >
                  {item.icon ? React.cloneElement(item.icon, { className: "w-5 h-5 text-muted-foreground group-hover:text-accent-foreground" }) : <div className="w-5 h-5 shrink-0"></div>}
                  <span>{item.label}</span>
                </Link>
              ))}
            {user && (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-destructive hover:text-destructive-foreground w-full justify-start text-base font-medium transition-colors mt-4"
              >
                <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive-foreground" />
                <span>Logout</span>
              </Button>
            )}
            {!user && (
              <div className="mt-6 space-y-2">
                 <Button asChild variant="default" className="w-full" onClick={toggleMenu}>
                    <Link href="/auth/signup">Sign Up</Link>
                 </Button>
                 <Button asChild variant="outline" className="w-full" onClick={toggleMenu}>
                    <Link href="/auth/signin">Sign In</Link>
                 </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

const getActingRoles = (supervisor: Supervisor): string[] => {
  const actingRoles = new Set<string>();
  if (!mockEmployees || mockEmployees.length === 0) return [];

  mockEmployees.forEach(emp => {
    if (emp.isPSN === supervisor.psn && supervisor.functionalRole !== 'IS') actingRoles.add('IS');
    if (emp.nsPSN === supervisor.psn && supervisor.functionalRole !== 'NS') actingRoles.add('NS');
    if (emp.dhPSN === supervisor.psn && supervisor.functionalRole !== 'DH') actingRoles.add('DH');
  });
  return Array.from(actingRoles);
}

const DropdownMenuUser = ({ user, logout }: {
    user: User;
    logout: () => void;
}) => {
  const supervisorUser = user.role !== 'Employee' ? user as Supervisor : null;
  let roleDisplay = user.role === 'Employee' ? 'Employee' : `${supervisorUser?.title} (${supervisorUser?.functionalRole})`;

  if (supervisorUser) {
    const acting = getActingRoles(supervisorUser);
    if (acting.length > 0) {
      roleDisplay += ` (acts as ${acting.join(', ')})`;
    }
  }
  
  const commonDropdownItems = [
    { href: '/profile', label: 'My Profile', icon: <UserCircle2 className="mr-2 h-4 w-4 text-muted-foreground"/> },
    { href: '/settings', label: 'Settings', icon: <Settings className="mr-2 h-4 w-4 text-muted-foreground"/> },
  ];
  if (user.role !== 'Employee') { // Add notifications for supervisors here, employees have it in main nav
     commonDropdownItems.push( { href: '/notifications', label: 'Notifications', icon: <Bell className="mr-2 h-4 w-4 text-muted-foreground"/> });
  }

  const managementSubItems = [
    { href: '/admin/add-employee', label: 'Manage Employees', icon: <Users className="mr-2 h-4 w-4"/> },
    { href: '/admin/add-supervisor', label: 'Manage Supervisors', icon: <UserCog className="mr-2 h-4 w-4"/> },
  ];
  const showAdminItems = supervisorUser && (supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head');


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserCircle2 className="h-5 w-5 text-muted-foreground hover:text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 py-1">
            <p className="text-sm font-semibold leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              PSN: {user.psn.toString()}
            </p>
            <p className="text-xs leading-none text-muted-foreground pt-0.5">
              {roleDisplay}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
        {commonDropdownItems.map(item => (
          <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
            <Link href={item.href} className="flex items-center w-full">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        </DropdownMenuGroup>

        {showAdminItems && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Admin Management</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {managementSubItems.map(subItem => (
                    <DropdownMenuItem key={subItem.href} asChild>
                      <Link href={subItem.href} className="flex items-center w-full">
                        {subItem.icon}
                        {subItem.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </>
        )}

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

    