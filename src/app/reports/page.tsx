
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import type { Supervisor, User } from "@/types"; // Import Supervisor type
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Filter, PlusCircle, User as UserIcon, Users, Paperclip, CalendarDays, BarChartHorizontal, MessageSquare, ArrowUpNarrowWide, Star, Database, CheckCircle, Tag, UsersRound, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { mockEmployees, mockSupervisors } from "@/data/mockData";

const filterOptions = [
  { label: "Agent (Supervisor)", value: "agent", icon: <UserIcon className="mr-2 h-4 w-4" /> }, // Updated label
  { label: "Assignment", value: "assignment", icon: <Users className="mr-2 h-4 w-4" /> },
  { label: "Attachments", value: "attachments", icon: <Paperclip className="mr-2 h-4 w-4" /> },
  { label: "Creation Date", value: "creationDate", icon: <CalendarDays className="mr-2 h-4 w-4" /> },
  { label: "Employee", value: "employee", icon: <UserIcon className="mr-2 h-4 w-4" /> }, // New filter for employee
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

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [openFilterPopover, setOpenFilterPopover] = useState(false);
  const { toast } = useToast();

  const handleSelectFilter = (value: string) => {
    toast({
      title: "Filter Selected",
      description: `Selected filter: ${value}. Further configuration would appear here.`,
    });
    setOpenFilterPopover(false);
  };

  const handleApplyFilters = () => {
    toast({
      title: "Action Triggered",
      description: "Filters would be applied and report data refreshed (Feature not implemented).",
    });
  };
  
  const handleDownloadReport = (currentUser: Supervisor) => {
     let reportScope = "their resolved tickets";
     if (currentUser.functionalRole === 'DH') reportScope = "tickets for their assigned cities";
     if (currentUser.functionalRole === 'IC Head') reportScope = "all tickets across all cities";

    toast({
      title: "Action Triggered",
      description: `Report download as .xlsx for ${reportScope} would start (Feature not implemented).`,
    });
  };

  return (
    <ProtectedPage allowedRoles={['IS', 'NS', 'DH', 'IC Head']}>
     {(currentUser: User) => {
        const currentSupervisorUser = currentUser as Supervisor;
        const canDownloadFullCityReport = currentSupervisorUser.functionalRole === 'DH';
        const canDownloadAllReports = currentSupervisorUser.functionalRole === 'IC Head';
        
        return (
            <div className="py-8">
                <Card className="w-full max-w-4xl mx-auto shadow-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Generate Reports</CardTitle>
                    <CardDescription>
                    Create and download reports based on ticket data. Your access level determines the scope of data you can report on.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    
                    <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">Filters</h3>
                    </div>
                    <Popover open={openFilterPopover} onOpenChange={setOpenFilterPopover}>
                        <PopoverTrigger asChild>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Filter</Button>
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
                        <h4 className="text-sm font-medium text-muted-foreground">Applied Filters: (Example Placeholders)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            
                            <div className="space-y-1">
                                <Label htmlFor="filter-status" className="text-xs">Status</Label>
                                <Select>
                                    <SelectTrigger id="filter-status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                        <SelectItem value="escalated-ns">Escalated to NS</SelectItem>
                                        <SelectItem value="escalated-dh">Escalated to DH</SelectItem>
                                        <SelectItem value="escalated-ic">Escalated to IC Head</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="filter-priority" className="text-xs">Priority</Label>
                                <Select>
                                    <SelectTrigger id="filter-priority">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-1">
                                <Label htmlFor="filter-creation-date" className="text-xs">Creation Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className="w-full justify-start text-left font-normal"
                                        >
                                        <CalendarDays className="mr-2 h-4 w-4" />
                                        {date ? new Date(date).toLocaleDateString() : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="filter-supervisor" className="text-xs">Assigned Supervisor (PSN/Name)</Label>
                                <Input id="filter-supervisor" placeholder="Enter Supervisor PSN or Name" 
                                       disabled={!canDownloadFullCityReport && !canDownloadAllReports} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="filter-employee" className="text-xs">Employee (PSN/Name)</Label>
                                <Input id="filter-employee" placeholder="Enter Employee PSN or Name" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="filter-project" className="text-xs">Project ID/Name</Label>
                                <Input id="filter-project" placeholder="Enter Project ID or Name" />
                            </div>
                        </div>
                        <Button className="mt-4" size="sm" variant="secondary" onClick={handleApplyFilters}>
                            Apply Filters
                        </Button>
                    </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-2 text-lg">Report Preview (Example Attributes)</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                            Reports will include fields like: Ticket ID, Employee PSN, Employee Name, Query, Priority, Status, Date Raised, Project, Assigned Supervisor, Resolution Steps, etc.
                        </p>
                        <div className="border rounded-md p-4 bg-background h-48 overflow-auto">
                            <p className="italic text-muted-foreground">Report data preview would appear here after applying filters...</p>
                        </div>
                    </div>

                    <Button className="w-full" onClick={() => handleDownloadReport(currentSupervisorUser)}
                            disabled={!(currentSupervisorUser.functionalRole === 'IS' || currentSupervisorUser.functionalRole === 'NS' || canDownloadFullCityReport || canDownloadAllReports)} >
                    <Download className="mr-2 h-4 w-4" /> 
                    Download Report (.xlsx)
                    {currentSupervisorUser.functionalRole === 'IS' && " (My Resolved)"}
                    {currentSupervisorUser.functionalRole === 'NS' && " (My Resolved)"}
                    {canDownloadFullCityReport && !canDownloadAllReports && " (My City/Cities)"}
                    {canDownloadAllReports && " (All Tickets)"}
                    </Button>
                </CardContent>
                </Card>
            </div>
        );
      }}
    </ProtectedPage>
  );
}

    