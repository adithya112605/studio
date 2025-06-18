
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import type { Supervisor, User, Ticket } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Filter, PlusCircle, User as UserIcon, Users, Paperclip, CalendarDays, BarChartHorizontal, MessageSquare, ArrowUpNarrowWide, Star, Database, CheckCircle, Tag, UsersRound, Briefcase, TrendingUp, AlertCircle, PieChart, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import React, { useState, useMemo } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { mockEmployees, mockSupervisors, mockTickets, mockProjects, mockJobCodes } from "@/data/mockData";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, PieChart as RechartsPieChart, Pie } from 'recharts'; // Renamed imports
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

const filterOptions = [
  { label: "Agent (Supervisor)", value: "agent", icon: <UserIcon className="mr-2 h-4 w-4" /> },
  { label: "Assignment", value: "assignment", icon: <Users className="mr-2 h-4 w-4" /> },
  { label: "Attachments", value: "attachments", icon: <Paperclip className="mr-2 h-4 w-4" /> },
  { label: "Creation Date", value: "creationDate", icon: <CalendarDays className="mr-2 h-4 w-4" /> },
  { label: "Employee", value: "employee", icon: <UserIcon className="mr-2 h-4 w-4" /> },
  { label: "Language", value: "language", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg> },
  { label: "Last Activity", value: "lastActivity", icon: <BarChartHorizontal className="mr-2 h-4 w-4" /> },
  { label: "Last Message", value: "lastMessage", icon: <MessageSquare className="mr-2 h-4 w-4" /> },
  { label: "Priority", value: "priority", icon: <ArrowUpNarrowWide className="mr-2 h-4 w-4" /> },
  { label: "Rating", value: "rating", icon: <Star className="mr-2 h-4 w-4" /> },
  { label: "Source", value: "source", icon: <Database className="mr-2 h-4 w-4" /> },
  { label: "Status", value: "status", icon: <CheckCircle className="mr-2 h-4 w-4" /> },
  { label: "Tag", value: "tag", icon: <Tag className="mr-2 h-4 w-4" /> },
  { label: "Team (Supervisor Level)", value: "team", icon: <UsersRound className="mr-2 h-4 w-4" /> },
  { label: "Project", value: "project", icon: <Briefcase className="mr-2 h-4 w-4" /> },
];

const ticketsByStatusChartConfig = {
  tickets: { label: "Tickets" },
  Open: { label: "Open", color: "hsl(var(--chart-1))" },
  InProgress: { label: "In Progress", color: "hsl(var(--chart-2))" },
  Pending: { label: "Pending", color: "hsl(var(--chart-3))" },
  Resolved: { label: "Resolved", color: "hsl(var(--chart-4))" },
  Closed: { label: "Closed", color: "hsl(var(--chart-5))" },
  EscalatedToNS: {label: "Esc. to NS", color: "hsl(var(--destructive))"},
  EscalatedToDH: {label: "Esc. to DH", color: "hsl(var(--destructive))"},
  EscalatedToICHead: {label: "Esc. to IC Head", color: "hsl(var(--destructive))"},
} satisfies ChartConfig;

const ticketsByPriorityChartConfig = {
  tickets: { label: "Tickets" },
  Low: { label: "Low", color: "hsl(var(--chart-5))" },
  Medium: { label: "Medium", color: "hsl(var(--chart-3))" },
  High: { label: "High", color: "hsl(var(--chart-2))" },
  Urgent: { label: "Urgent", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const initialFilterState = {
  status: 'all', priority: 'all', creationDate: new Date(), supervisor: '', employee: '', project: ''
};

export default function ReportsPage() {
  const { toast } = useToast();
  const [openFilterPopover, setOpenFilterPopover] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialFilterState);

  const handleSelectFilter = (value: string) => {
    toast({
      title: "Filter Criteria Selected",
      description: `Selected filter: ${value}. Configure its value in the 'Applied Filters' section.`,
    });
    setOpenFilterPopover(false);
  };

  const handleApplyFilters = () => {
    toast({
      title: "Filters Applied (Mock)",
      description: "Report data preview and charts would be refreshed based on the selected filters. Actual filtering logic for charts is simplified for this demo.",
    });
  };

  const handleClearFilters = () => {
    setActiveFilters(initialFilterState);
    toast({
        title: "Filters Cleared",
        description: "All filter criteria have been reset. Charts and preview will update.",
    });
  };

  const handleDownloadReport = (currentUser: Supervisor, filtered: boolean) => {
     let reportScope = "their resolved/assigned tickets";
     if (currentUser.functionalRole === 'DH') reportScope = "tickets for their assigned cities/department";
     if (currentUser.functionalRole === 'IC Head') reportScope = "all tickets across all cities";

     let filterDescription = "";
     if (filtered) {
         const applied = Object.entries(activeFilters)
            .filter(([key, value]) => value !== 'all' && (key !== 'creationDate' || value !== initialFilterState.creationDate) && value !== '')
            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${key === 'creationDate' ? new Date(value as Date).toLocaleDateString() : value}`)
            .join(', ');
        filterDescription = applied ? ` (Filters: ${applied})` : " (No active filters applied)";
     }


    toast({
      title: "Download Report Initiated (Mock)",
      description: `Report download as .xlsx for ${reportScope}${filterDescription} would start. The Excel file would notionally include relevant data and charts. Actual file generation is a backend feature.`,
      duration: 5000,
    });
  };
  
  const getFilteredTicketsForCharts = (currentUser: Supervisor) => {
    let tickets: Ticket[] = [];
    
    if (currentUser.functionalRole === 'IC Head') {
        tickets = mockTickets;
    } else if (currentUser.functionalRole === 'DH') {
        const dhManagedEmployeePSNs = mockEmployees.filter(e => e.dhPSN === currentUser.psn).map(e => e.psn);
        tickets = mockTickets.filter(ticket => 
            ticket.currentAssigneePSN === currentUser.psn ||
            (ticket.status === 'Escalated to DH' && dhManagedEmployeePSNs.includes(ticket.psn)) ||
            (currentUser.cityAccess?.some(city => mockProjects.find(p => p.id === ticket.project)?.city === city)) // Tickets from projects in their cities
        );
    } else if (currentUser.functionalRole === 'NS') {
        const nsManagedEmployeePSNs = mockEmployees.filter(e => e.nsPSN === currentUser.psn).map(e => e.psn);
        tickets = mockTickets.filter(ticket =>
            ticket.currentAssigneePSN === currentUser.psn ||
            (ticket.status === 'Escalated to NS' && nsManagedEmployeePSNs.includes(ticket.psn))
        );
    } else if (currentUser.functionalRole === 'IS') {
         tickets = mockTickets.filter(ticket =>
            ticket.currentAssigneePSN === currentUser.psn ||
            (ticket.status === 'Open' && mockEmployees.find(e => e.psn === ticket.psn)?.isPSN === currentUser.psn)
        );
    }
    
    // Apply activeFilters from state for chart data
    return tickets.filter(ticket => {
        const statusMatch = activeFilters.status === 'all' || ticket.status === activeFilters.status;
        const priorityMatch = activeFilters.priority === 'all' || ticket.priority === activeFilters.priority;
        // Add other filters like date, supervisor, employee, project if needed for chart filtering
        return statusMatch && priorityMatch;
    });
  };


  return (
    <ProtectedPage allowedRoles={['IS', 'NS', 'DH', 'IC Head']}>
     {(currentUser: User) => {
        const currentSupervisorUser = currentUser as Supervisor;
        
        const chartDataTickets = getFilteredTicketsForCharts(currentSupervisorUser);

        const ticketsByStatusData = Object.entries(
            chartDataTickets.reduce((acc, ticket) => {
                const statusKey = ticket.status.replace(/\s+/g, '').replace(/to/g, 'To'); // e.g. EscalatedToNS
                acc[statusKey] = (acc[statusKey] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        ).map(([name, value]) => ({ name, tickets: value, fill: `var(--color-${name})` }));
        
        const ticketsByPriorityData = Object.entries(
            chartDataTickets.reduce((acc, ticket) => {
                acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        ).map(([name, value]) => ({ name, tickets: value, fill: `var(--color-${name})` }));


        return (
            <div className="py-8 space-y-8">
                <Card className="w-full max-w-6xl mx-auto shadow-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Reports & Analytics</CardTitle>
                    <CardDescription>
                    Generate and download reports. Visualize ticket data with interactive charts. Your access level determines the data scope.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold flex items-center"><PieChart className="mr-2 h-5 w-5 text-primary"/>Tickets by Status</CardTitle>
                                <CardDescription>Distribution of tickets based on their current status.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                {ticketsByStatusData.length > 0 ? (
                                <ChartContainer config={ticketsByStatusChartConfig} className="w-full h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                            <Pie data={ticketsByStatusData} dataKey="tickets" nameKey="name" labelLine={false} label={({ name, percent }) => `${ticketsByStatusChartConfig[name as keyof typeof ticketsByStatusChartConfig]?.label || name}: ${(percent * 100).toFixed(0)}%`}/>
                                            <ChartLegend content={<ChartLegendContent nameKey="name" formatter={(value) => ticketsByStatusChartConfig[value as keyof typeof ticketsByStatusChartConfig]?.label || value}/>} />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                                ) : <p className="text-muted-foreground text-center pt-10">No data to display for current filters.</p>}
                            </CardContent>
                        </Card>
                         <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/>Tickets by Priority</CardTitle>
                                <CardDescription>Breakdown of tickets by their assigned priority level.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                {ticketsByPriorityData.length > 0 ? (
                                <ChartContainer config={ticketsByPriorityChartConfig} className="w-full h-full">
                                     <ResponsiveContainer width="100%" height="100%">
                                        <RechartsBarChart data={ticketsByPriorityData} layout="vertical" margin={{left:10, right:30}}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} strokeWidth={0} width={80} 
                                                   tickFormatter={(value) => ticketsByPriorityChartConfig[value as keyof typeof ticketsByPriorityChartConfig]?.label || value } />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" nameKey="name" formatter={(value, name) => [(value), ticketsByPriorityChartConfig[name as keyof typeof ticketsByPriorityChartConfig]?.label || name]} />} />
                                            <Bar dataKey="tickets" radius={5} background={{ fillOpacity: 0.1, radius: 5 }}>
                                                {ticketsByPriorityData.map((entry, index) => (
                                                    <div key={`cell-${index}`} style={{backgroundColor: entry.fill}} />
                                                ))}
                                            </Bar>
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                                ) : <p className="text-muted-foreground text-center pt-10">No data to display for current filters.</p>}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4 pt-6 border-t">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Filter className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold text-lg">Report Filters</h3>
                            </div>
                             <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-muted-foreground hover:text-primary">
                                <XCircle className="mr-2 h-4 w-4" /> Clear All Filters
                            </Button>
                        </div>
                        <Popover open={openFilterPopover} onOpenChange={setOpenFilterPopover}>
                            <PopoverTrigger asChild>
                            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Filter Criteria (Select to enable fields)</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 p-0">
                                <Command>
                                    <CommandInput placeholder="Search filters..." />
                                    <CommandList>
                                        <CommandEmpty>No filter found.</CommandEmpty>
                                        <CommandGroup>
                                            {filterOptions.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                onSelect={() => handleSelectFilter(option.value)}
                                                className="flex items-center cursor-pointer"
                                            >
                                                {option.icon}
                                                <span>{option.label}</span>
                                            </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        <div className="space-y-3 mt-4 p-4 border rounded-md bg-muted/30">
                            <h4 className="text-sm font-medium text-muted-foreground">Applied Filters:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="filter-status" className="text-xs">Status</Label>
                                    <Select value={activeFilters.status} onValueChange={(val) => setActiveFilters(prev => ({...prev, status: val}))}>
                                        <SelectTrigger id="filter-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {['Open', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Escalated to NS', 'Escalated to DH', 'Escalated to IC Head'].map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="filter-priority" className="text-xs">Priority</Label>
                                    <Select value={activeFilters.priority} onValueChange={(val) => setActiveFilters(prev => ({...prev, priority: val}))}>
                                        <SelectTrigger id="filter-priority"><SelectValue placeholder="Select priority" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priorities</SelectItem>
                                            {['Low', 'Medium', 'High', 'Urgent'].map(p => ( <SelectItem key={p} value={p}>{p}</SelectItem> ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="filter-creation-date" className="text-xs">Creation Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                                <CalendarDays className="mr-2 h-4 w-4" />
                                                {activeFilters.creationDate ? new Date(activeFilters.creationDate).toLocaleDateString() : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={activeFilters.creationDate} onSelect={(dateVal) => setActiveFilters(prev => ({...prev, creationDate: dateVal || new Date()}))} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="filter-supervisor" className="text-xs">Assigned Supervisor (PSN/Name)</Label>
                                    <Input id="filter-supervisor" placeholder="Enter Supervisor PSN or Name" value={activeFilters.supervisor} onChange={(e) => setActiveFilters(prev => ({...prev, supervisor: e.target.value}))}
                                           disabled={!(currentSupervisorUser.functionalRole === 'DH' || currentSupervisorUser.functionalRole === 'IC Head')} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="filter-employee" className="text-xs">Employee (PSN/Name)</Label>
                                    <Input id="filter-employee" placeholder="Enter Employee PSN or Name" value={activeFilters.employee} onChange={(e) => setActiveFilters(prev => ({...prev, employee: e.target.value}))} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="filter-project" className="text-xs">Project ID/Name</Label>
                                    <Input id="filter-project" placeholder="Enter Project ID or Name" value={activeFilters.project} onChange={(e) => setActiveFilters(prev => ({...prev, project: e.target.value}))} />
                                </div>
                            </div>
                            <Button className="mt-4" size="sm" variant="secondary" onClick={handleApplyFilters}>Apply Filters & Refresh Charts</Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2 text-lg">Report Preview (Example Attributes)</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                            Reports would include fields like: Ticket ID, Employee PSN, Employee Name, Query, Priority, Status, Date Raised, Project, Assigned Supervisor, Resolution Steps, etc. Actual file generation is mocked.
                        </p>
                        <div className="border rounded-md p-4 bg-background h-48 overflow-auto">
                            <p className="italic text-muted-foreground">Filtered report data preview would appear here based on mock logic...</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <Button className="w-full" onClick={() => handleDownloadReport(currentSupervisorUser, false)}
                                disabled={!(currentSupervisorUser.functionalRole === 'IS' || currentSupervisorUser.functionalRole === 'NS' || currentSupervisorUser.functionalRole === 'DH' || currentSupervisorUser.functionalRole === 'IC Head')} >
                        <Download className="mr-2 h-4 w-4" />
                        Download Full Report (.xlsx)
                        {currentSupervisorUser.functionalRole === 'IS' && " (My Resolved/Assigned)"}
                        {currentSupervisorUser.functionalRole === 'NS' && " (My Resolved/Assigned)"}
                        {currentSupervisorUser.functionalRole === 'DH' && " (My City/Dept Scope)"}
                        {currentSupervisorUser.functionalRole === 'IC Head' && " (All Tickets Scope)"}
                        </Button>
                         <Button className="w-full" variant="outline" onClick={() => handleDownloadReport(currentSupervisorUser, true)}
                                disabled={!(currentSupervisorUser.functionalRole === 'IS' || currentSupervisorUser.functionalRole === 'NS' || currentSupervisorUser.functionalRole === 'DH' || currentSupervisorUser.functionalRole === 'IC Head')} >
                        <Download className="mr-2 h-4 w-4" />
                        Download Filtered Report (.xlsx)
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Note: Excel generation with embedded charts is a backend feature and is only mocked here. Downloads will trigger a notification.</p>
                </CardContent>
                </Card>
            </div>
        );
      }}
    </ProtectedPage>
  );
}
