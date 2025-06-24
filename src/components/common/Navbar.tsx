
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PanelLeft, X, Home, Briefcase, Bell, Settings, LogOut, UserPlus, FileText, UserCircle2, Ticket, Users, FileSpreadsheet, BarChart3, UserCog, ChevronDown, Building, LogIn, Info, Sparkles, Sun, Moon, Loader2 } from 'lucide-react';
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
import { useRouter, usePathname } from 'next/navigation';
import LTLogo from './LTLogo';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAllEmployeesAction } from '@/lib/actions';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false); 
    await logout();
    router.push('/');
  };

  
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
    { href: '/supervisor/employee-details', label: 'Employee Details', icon: <Users /> },
    { href: '/reports', label: 'Reports', icon: <BarChart3 /> },
    { href: '/notifications', label: 'Notifications', icon: <Bell /> },
    { href: '/settings', label: 'Settings', icon: <Settings /> },
  ];
  const adminManagementNavItemsMobile = [
     { href: '/admin/add-employee', label: 'Manage Employees', icon: <UserPlus /> },
     { href: '/admin/add-supervisor', label: 'Manage Supervisors', icon: <UserCog /> },
  ];
  const unauthenticatedNavItemsMobile = [
    { href: '/auth/signin', label: 'Sign In', icon: <LogIn /> },
    { href: '/auth/signup', label: 'Sign Up', icon: <UserPlus /> },
    { href: '/', label: 'Home', icon: <Home /> },
    { href: '/#features', label: 'Features', icon: <Sparkles /> },
    { href: '/#contact', label: 'Contact', icon: <Info /> },
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

  
  let desktopNavLinks: Array<{href?:string; label:string; isDropdown?: boolean; subItems?: Array<{href:string; label:string; icon?: React.ReactNode; description?: string}>; description?: string}> = [];
  if (user) {
    desktopNavLinks.push({ href: '/dashboard', label: 'Dashboard', description: 'Access your personalized overview, recent activities, and quick links to key system functionalities. Manage your tasks and stay updated with important notifications.'});
    if (user.role === 'Employee') {
      desktopNavLinks.push({ href: '/employee/tickets', label: 'My Tickets', description: 'View a comprehensive list of all support tickets you have raised. Check their current status, review historical interactions, and add follow-up information.'});
      desktopNavLinks.push({ href: '/tickets/new', label: 'Create Ticket', description: 'Initiate a new support request by detailing your issue or query for the HR team to address. Attach relevant files and set priority for faster resolution.'});
    } else { 
      const supervisorUser = user as Supervisor;
      desktopNavLinks.push({ href: '/hr/tickets', label: 'Ticket Mgt.', description: 'Oversee, assign, and manage the lifecycle of support tickets relevant to your team or department. Escalate issues and monitor resolution progress.'});
      desktopNavLinks.push({ href: '/supervisor/employee-details', label: 'Employees', description: 'Access and review detailed information about employees under your supervision or within your designated scope. View their project assignments and hierarchy.'});
      desktopNavLinks.push({ href: '/reports', label: 'Reports', description: 'Generate, view, and analyze various system reports related to ticket trends, employee performance, and operational metrics to gain insights.'});
      if (supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head') {
        desktopNavLinks.push({
          label: 'Admin Tools',
          isDropdown: true,
          subItems: [
            { href: '/admin/add-employee', label: 'Add Employee', icon: <UserPlus className="mr-2 h-4 w-4"/>, description: 'Create new employee profiles in the system, assigning them to projects, job codes, and relevant supervisors.' },
            { href: '/admin/add-supervisor', label: 'Add Supervisor', icon: <UserCog className="mr-2 h-4 w-4"/>, description: 'Onboard new supervisors, defining their roles, project affiliations, and city access levels within the helpdesk system.' },
          ]
        });
      }
    }
  } else {
    // Nav links for non-authenticated users
    desktopNavLinks.push(
        { href: '/#features', label: 'Features', description: 'Explore the key functionalities of the L&T Helpdesk system designed for efficient internal support.' },
        { href: '/#contact', label: 'Contact Us', description: 'Get in touch with support for assistance or inquiries about the L&T Helpdesk platform.' }
    );
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4">
        <div className="flex items-center">
            <div className="md:hidden mr-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="h-9 w-9 text-muted-foreground">
                    <PanelLeft className="h-5 w-5" />
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 bg-background text-foreground flex flex-col">
                    <SheetHeader className="p-4 border-b">
                       <SheetClose asChild>
                            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                                <LTLogo className="h-7 w-7" />
                                <SheetTitle asChild><span className="font-bold font-headline text-lg text-foreground">L&T Helpdesk</span></SheetTitle>
                            </Link>
                        </SheetClose>
                    </SheetHeader>
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
                    </nav>
                    <SheetFooter className="p-4 border-t">
                    {user ? (
                       <SheetClose asChild>
                        <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="group flex items-center space-x-3 rounded-md text-sm font-medium transition-colors hover:bg-destructive hover:text-destructive-foreground w-full justify-start text-muted-foreground hover:text-destructive-foreground" 
                        >
                        <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive-foreground" />
                        <span>Logout</span>
                        </Button>
                       </SheetClose>
                    ) : (
                        <div className="space-y-2 w-full">
                            <SheetClose asChild>
                            <Button asChild variant="default" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsOpen(false)}>
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
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            </div>
            <Link href="/" className="flex items-center space-x-2 mr-6 shrink-0">
            <LTLogo className="h-8 w-8" /> 
            <span className="font-bold font-headline text-xl hidden sm:inline-block text-foreground">L&T Helpdesk</span>
            </Link>
        </div>

        
          <nav className="hidden md:flex flex-grow items-center justify-center space-x-1 lg:space-x-2 text-sm ml-6">
            {desktopNavLinks.map((item) =>
              item.isDropdown && item.subItems ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 font-medium h-9 text-sm">
                      {item.label} <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72 bg-popover text-popover-foreground border-border">
                    {item.subItems.map(subItem => (
                      <DropdownMenuItem key={subItem.href} asChild className="hover:bg-accent/50 focus:bg-accent/50">
                         <Link href={subItem.href} className="flex items-center w-full group p-2">
                            <div className="flex-shrink-0 mr-2 text-muted-foreground group-hover:text-accent-foreground"> {subItem.icon || <div className="h-4 w-4"></div>}</div>
                            <div className="flex flex-col">
                                <span className="font-medium group-hover:text-primary">{subItem.label}</span>
                                {subItem.description && <p className="text-xs text-muted-foreground whitespace-normal group-hover:text-accent-foreground">{subItem.description}</p>}
                            </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" asChild className="px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 font-medium h-9 text-sm">
                      <Link href={item.href!}>{item.label}</Link>
                    </Button>
                  </TooltipTrigger>
                  {item.description && <TooltipContent side="bottom" className="max-w-xs bg-popover text-popover-foreground border-border"><p>{item.description}</p></TooltipContent>}
                </Tooltip>
              )
            )}
          </nav>
        
        {!user && desktopNavLinks.length === 0 && <div className="flex-grow hidden md:block"></div>}


        <div className="flex items-center space-x-1 md:space-x-2 ml-auto shrink-0">
          <ThemeToggle />
          {loading ? (
             <div className="h-9 w-9 flex items-center justify-center">
               <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
             </div>
          ) : user ? (
             <div className="flex items-center space-x-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-foreground hover:text-primary hover:bg-primary/5">
                            <Link href="/notifications" aria-label="Notifications"><Bell className="w-5 h-5"/></Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border"><p>View Notifications</p></TooltipContent>
                </Tooltip>
              <DropdownMenuUser user={user} logout={handleLogout} />
             </div>
          ) : (
             <div className="hidden md:flex items-center space-x-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="ghost" className="font-medium text-foreground px-4 h-9 text-sm">
                            <Link href="/auth/signin">SIGN IN</Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border"><p>Access your account</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-9 text-sm font-semibold rounded-full">
                            <Link href="/auth/signup">GET STARTED</Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border"><p>Create a new account</p></TooltipContent>
                </Tooltip>
            </div>
          )}
        </div>
      </div>
    </header>
    </TooltipProvider>
  );
};

const getActingRoles = (supervisor: Supervisor, allEmployees: Employee[]): string[] => {
  const actingRoles = new Set<string>();
  if (!allEmployees || allEmployees.length === 0) return [];

  allEmployees.forEach(emp => {
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
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supervisorUser = user.role !== 'Employee' ? user as Supervisor : null;

  useEffect(() => {
    if (supervisorUser) {
        setIsLoading(true);
        getAllEmployeesAction()
            .then(data => setAllEmployees(data))
            .catch(err => console.error("Failed to fetch employees for navbar", err))
            .finally(() => setIsLoading(false));
    } else {
        setIsLoading(false);
    }
  }, [supervisorUser]);

  let roleDisplay = user.role === 'Employee' ? 'Employee' : `${supervisorUser?.title} (${supervisorUser?.functionalRole})`;

  if (supervisorUser && !isLoading) {
    const acting = getActingRoles(supervisorUser, allEmployees);
    if (acting.length > 0) {
      roleDisplay += ` (acts as ${acting.join(', ')})`;
    }
  }
  
  const commonDropdownItems = [
    { href: '/profile', label: 'My Profile', icon: <UserCircle2 className="mr-2 h-4 w-4 text-muted-foreground"/> },
    { href: '/settings', label: 'Settings', icon: <Settings className="mr-2 h-4 w-4 text-muted-foreground"/> },
  ];

  const managementSubItems = [
    { href: '/admin/add-employee', label: 'Add Employee', icon: <UserPlus className="mr-2 h-4 w-4"/>, description: "Add new employee profiles and assign roles." },
    { href: '/admin/add-supervisor', label: 'Add Supervisor', icon: <UserCog className="mr-2 h-4 w-4"/>, description: "Onboard new supervisors and define access levels." },
  ];
  const showAdminItems = supervisorUser && (supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head');


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <UserCircle2 className="h-5 w-5 text-foreground hover:text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 bg-popover text-popover-foreground border-border" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 py-1">
            <p className="text-sm font-semibold leading-none text-foreground">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              PSN: {user.psn.toString()}
            </p>
            {isLoading && supervisorUser ? (
                <div className="flex items-center pt-1">
                    <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                    <span className="text-xs text-muted-foreground">Loading role details...</span>
                </div>
            ) : (
                <p className="text-xs leading-none text-muted-foreground pt-0.5 truncate" title={roleDisplay}>
                {roleDisplay}
                </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuGroup>
        {commonDropdownItems.map(item => (
          <DropdownMenuItem key={item.href} asChild className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50">
            <Link href={item.href} className="flex items-center w-full">
              {item.icon}
              <span className="text-popover-foreground">{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        </DropdownMenuGroup>

        {showAdminItems && (
          <>
            <DropdownMenuSeparator className="bg-border"/>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="hover:bg-accent/50 focus:bg-accent/50 data-[state=open]:bg-accent/50">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-popover-foreground">Admin Management</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-72 bg-popover text-popover-foreground border-border"> 
                  {managementSubItems.map(subItem => (
                    <DropdownMenuItem key={subItem.href} asChild className="hover:bg-accent/50 focus:bg-accent/50">
                       <Link href={subItem.href} className="flex items-start w-full group p-2">
                          <div className="flex-shrink-0 mr-2 mt-0.5 text-muted-foreground group-hover:text-accent-foreground"> {subItem.icon || <div className="h-4 w-4"></div>}</div>
                          <div className="flex flex-col">
                              <span className="text-sm font-medium text-popover-foreground group-hover:text-primary">{subItem.label}</span>
                              {subItem.description && <p className="text-xs text-muted-foreground whitespace-normal leading-tight group-hover:text-accent-foreground">{subItem.description}</p>}
                          </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </>
        )}

        <DropdownMenuSeparator className="bg-border"/>
        <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive/90 hover:bg-destructive/10!important">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Navbar;
