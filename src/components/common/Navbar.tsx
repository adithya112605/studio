
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Briefcase, Bell, Settings, LogOut, UserPlus, ShieldCheck, FileText, UserCircle2, Ticket, Users, FileSpreadsheet, BarChart3, UserSquare2, Eye, LogIn, UserCog, ChevronDown, Building, PanelLeft, Info } from 'lucide-react';
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
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from 'next/navigation';
import LTLogo from './LTLogo';
import { cn } from '@/lib/utils';
import { mockEmployees } from '@/data/mockData';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet'; // Updated import for Sheet & SheetTitle
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // For active link styling in mobile

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close mobile menu on logout
    router.push('/');
  };

  // Navigation items for mobile (will be styled like "Christina's" sidebar)
  const commonAuthenticatedNavItemsBaseMobile = [
    { href: '/', label: 'Home', icon: <Home /> },
    { href: '/dashboard', label: 'Dashboard', icon: <Briefcase /> },
    { href: '/profile', label: 'My Profile', icon: <UserCircle2 /> },
  ];
  const employeeNavItemsMobile = [
    ...commonAuthenticatedNavItemsBaseMobile,
    { href: '/tickets/new', label: 'Create Ticket', icon: <Ticket /> },
    { href: '/employee/tickets', label: 'My Tickets', icon: <FileText /> },
    { href: '/notifications', label: 'Notifications', icon: <Bell /> },
    { href: '/settings', label: 'Settings', icon: <Settings /> },
  ];
  const supervisorBaseNavItemsMobile = [
    ...commonAuthenticatedNavItemsBaseMobile,
    { href: '/hr/tickets', label: 'Ticket Management', icon: <FileSpreadsheet /> },
    { href: '/supervisor/employee-details', label: 'Employee Details', icon: <Eye /> },
    { href: '/reports', label: 'Reports', icon: <BarChart3 /> },
    { href: '/notifications', label: 'Notifications', icon: <Bell /> },
    { href: '/settings', label: 'Settings', icon: <Settings /> },
  ];
  const adminManagementNavItemsMobile = [
     { href: '/admin/add-employee', label: 'Manage Employees', icon: <Users /> },
     { href: '/admin/add-supervisor', label: 'Manage Supervisors', icon: <UserSquare2 /> },
  ];
  const unauthenticatedNavItemsMobile = [
    { href: '/auth/signin', label: 'Sign In', icon: <LogIn /> },
    { href: '/auth/signup', label: 'Sign Up', icon: <UserPlus /> },
    { href: '/', label: 'Home', icon: <Home /> },
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
  let desktopNavLinks: Array<{href?:string; label:string; isDropdown?: boolean; subItems?: Array<{href:string; label:string; icon?: React.ReactNode; description?: string}>; description?: string}> = [];
  if (user) {
    desktopNavLinks.push({ href: '/dashboard', label: 'Dashboard', description: 'View your main dashboard.'});
    if (user.role === 'Employee') {
      desktopNavLinks.push({ href: '/employee/tickets', label: 'My Tickets', description: 'View and manage your support tickets.'});
      desktopNavLinks.push({ href: '/tickets/new', label: 'Create Ticket', description: 'Raise a new support ticket.'});
    } else { // Supervisor roles
      const supervisorUser = user as Supervisor;
      desktopNavLinks.push({ href: '/hr/tickets', label: 'Ticket Mgt.', description: 'Manage and assign support tickets.'});
      desktopNavLinks.push({ href: '/supervisor/employee-details', label: 'Employees', description: 'View details of employees.'});
      desktopNavLinks.push({ href: '/reports', label: 'Reports', description: 'Generate and view system reports.'});
      if (supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head') {
        desktopNavLinks.push({
          label: 'Admin',
          isDropdown: true,
          subItems: [
            { href: '/admin/add-employee', label: 'Add Employee', icon: <UserPlus className="mr-2 h-4 w-4"/>, description: 'Add new employees to the system.' },
            { href: '/admin/add-supervisor', label: 'Add Supervisor', icon: <UserCog className="mr-2 h-4 w-4"/>, description: 'Add new supervisors to the system.' },
          ]
        });
      }
    }
  }


  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-muted rounded-md animate-pulse"></div>
            <div className="h-5 w-32 bg-muted rounded animate-pulse hidden sm:block"></div>
          </div>
          <div className="flex items-center space-x-2">
             <div className="h-8 w-8 bg-muted rounded-md animate-pulse"></div>
             <div className="h-8 w-20 bg-muted rounded-md animate-pulse hidden md:block"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card text-card-foreground shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4">
        <div className="flex items-center">
            <div className="md:hidden mr-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="h-9 w-9 text-muted-foreground">
                    <PanelLeft className="h-5 w-5" />
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 bg-background text-foreground">
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b">
                           <SheetClose asChild>
                                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                                    <LTLogo className="h-7 w-7" />
                                    <SheetTitle asChild>
                                        <span className="font-bold font-headline text-lg">L&T Helpdesk</span>
                                    </SheetTitle>
                                </Link>
                            </SheetClose>
                        </div>
                        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
                        {navItemsForMobile.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                            <SheetClose asChild key={item.label + item.href}>
                                <Link
                                href={item.href}
                                className={cn(
                                    "group flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                                >
                                {item.icon ? React.cloneElement(item.icon, { className: cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground") }) : <div className="w-5 h-5 shrink-0"></div>}
                                <span>{item.label}</span>
                                </Link>
                            </SheetClose>
                            );
                        })}
                        {user && (
                           <SheetClose asChild>
                            <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="group flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-destructive hover:text-destructive-foreground w-full justify-start text-muted-foreground hover:text-destructive-foreground mt-auto" 
                            >
                            <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive-foreground" />
                            <span>Logout</span>
                            </Button>
                           </SheetClose>
                        )}
                        </nav>
                        {!user && (
                            <div className="p-4 border-t space-y-2">
                                <SheetClose asChild>
                                <Button asChild variant="default" className="w-full" onClick={() => setIsOpen(false)}>
                                    <Link href="/auth/signup">Sign Up</Link>
                                </Button>
                                </SheetClose>
                                <SheetClose asChild>
                                <Button asChild variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                                    <Link href="/auth/signin">Sign In</Link>
                                </Button>
                                </SheetClose>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
            </div>
            <Link href="/" className="flex items-center space-x-2 mr-6 shrink-0">
            <LTLogo className="h-8 w-8" /> 
            <span className="font-bold font-headline text-xl hidden sm:inline-block">L&T Helpdesk</span>
            </Link>
        </div>

        {user && (
          <nav className="hidden md:flex flex-grow items-center space-x-1 lg:space-x-2 text-sm ml-6">
            {desktopNavLinks.map((item) =>
              item.isDropdown && item.subItems ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/10 font-medium h-9 text-sm">
                      {item.label} <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
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
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" asChild className="px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/10 font-medium h-9 text-sm">
                      <Link href={item.href!}>{item.label}</Link>
                    </Button>
                  </TooltipTrigger>
                  {item.description && <TooltipContent side="bottom"><p>{item.description}</p></TooltipContent>}
                </Tooltip>
              )
            )}
          </nav>
        )}
        {!user && <div className="flex-grow hidden md:block"></div>}

        <div className="flex items-center space-x-1 md:space-x-2 ml-auto shrink-0">
          <ThemeToggle />
          {user ? (
             <div className="flex items-center space-x-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5">
                            <Link href="/notifications" aria-label="Notifications"><Bell className="w-5 h-5"/></Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom"><p>View Notifications</p></TooltipContent>
                </Tooltip>
              <DropdownMenuUser user={user} logout={handleLogout} />
             </div>
          ) : (
             <div className="hidden md:flex items-center space-x-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="ghost" className="font-medium text-muted-foreground hover:text-primary px-4 h-9 text-sm">
                            <Link href="/auth/signin">SIGN IN</Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom"><p>Access your account</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-9 text-sm font-semibold">
                            <Link href="/auth/signup">GET STARTED</Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom"><p>Create a new account</p></TooltipContent>
                </Tooltip>
            </div>
          )}
        </div>
      </div>
    </header>
    </TooltipProvider>
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

  const managementSubItems = [
    { href: '/admin/add-employee', label: 'Manage Employees', icon: <Users className="mr-2 h-4 w-4"/> },
    { href: '/admin/add-supervisor', label: 'Manage Supervisors', icon: <UserCog className="mr-2 h-4 w-4"/> },
  ];
  const showAdminItems = supervisorUser && (supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head');


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
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
            <p className="text-xs leading-none text-muted-foreground pt-0.5 truncate" title={roleDisplay}>
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
