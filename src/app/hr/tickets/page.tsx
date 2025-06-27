
"use client";

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Ticket, Supervisor, Employee } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, ArrowLeft, Filter, Search, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState, useMemo, useEffect } from "react";
import ScrollReveal from "@/components/common/ScrollReveal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getAllTicketsAction, getAllSupervisorsAction, getAllEmployeesAction } from "@/lib/actions";

const getStatusBadgeVariant = (status: Ticket['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Open': return 'destructive';
    case 'In Progress': return 'default'; 
    case 'Pending': return 'outline'; 
    case 'Resolved': case 'Closed': return 'secondary';
    case 'Escalated to NS': case 'Escalated to DH': case 'Escalated to IC Head': return 'default'; 
    default: return 'outline';
  }
};

interface SupervisorTicketsPageContentProps {
  currentUser: Supervisor;
  searchTerm: string;
  statusFilter: Ticket['status'] | "all";
  priorityFilter: Ticket['priority'] | "all";
  allTickets: Ticket[];
  allEmployees: Employee[];
  allSupervisors: Supervisor[];
}

const SupervisorTicketsPageContent: React.FC<SupervisorTicketsPageContentProps> = ({
  currentUser,
  searchTerm,
  statusFilter,
  priorityFilter,
  allTickets,
  allEmployees,
  allSupervisors,
}) => {
  const filteredTickets = useMemo(() => {
    let tickets: Ticket[] = [];

    // Correctly filter tickets based on the supervisor's scope of management
    if (currentUser.functionalRole === 'IC Head') {
        tickets = allTickets;
    } else if (currentUser.functionalRole === 'DH') {
        const managedEmployeePsns = new Set(allEmployees.filter(e => e.dhPSN === currentUser.psn).map(e => e.psn));
        tickets = allTickets.filter(ticket => managedEmployeePsns.has(ticket.psn));
    } else if (currentUser.functionalRole === 'NS') {
        const managedEmployeePsns = new Set(allEmployees.filter(e => e.nsPSN === currentUser.psn).map(e => e.psn));
        tickets = allTickets.filter(ticket => managedEmployeePsns.has(ticket.psn));
    } else if (currentUser.functionalRole === 'IS') {
        const managedEmployeePsns = new Set(allEmployees.filter(e => e.isPSN === currentUser.psn).map(e => e.psn));
        tickets = allTickets.filter(ticket => managedEmployeePsns.has(ticket.psn));
    }

    return tickets.filter(ticket => {
        const searchMatch = ticket.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.psn.toString().includes(searchTerm);
        const statusMatch = statusFilter === "all" || ticket.status === statusFilter;
        const priorityMatch = priorityFilter === "all" || ticket.priority === priorityFilter;
        return searchMatch && statusMatch && priorityMatch;
    });
  }, [currentUser, searchTerm, statusFilter, priorityFilter, allTickets, allEmployees]);

  return (
    <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={200}>
      {filteredTickets.length > 0 ? (
        <Card className="shadow-lg mt-6 transition-shadow hover:shadow-xl">
          <CardHeader>
            <CardTitle>Ticket Queue ({filteredTickets.length})</CardTitle>
            <CardDescription>A complete list of tickets relevant to your scope.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Query (Summary)</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Raised</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map(ticket => {
                    const assignee = allSupervisors.find(s => s.psn === ticket.currentAssigneePSN);
                    return (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.employeeName} ({ticket.psn})</TableCell>
                        <TableCell>{ticket.query.substring(0, 40)}...</TableCell>
                        <TableCell><Badge variant={ticket.priority === "Urgent" || ticket.priority === "High" ? "destructive" : "secondary"}>{ticket.priority}</Badge></TableCell>
                        <TableCell><Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge></TableCell>
                        <TableCell>{new Date(ticket.dateOfQuery).toLocaleDateString()}</TableCell>
                        <TableCell>{assignee ? `${assignee.name} (${assignee.title})` : 'Unassigned'}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/tickets/${ticket.id}`}>View / Manage</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-10 shadow-lg mt-6 transition-shadow hover:shadow-xl">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tickets found matching your criteria in your queue.</p>
          </CardContent>
        </Card>
      )}
    </ScrollReveal>
  );
};

export default function SupervisorTicketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Ticket['status'] | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Ticket['priority'] | "all">("all");
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [allSupervisors, setAllSupervisors] = useState<Supervisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tickets, employees, supervisors] = await Promise.all([
          getAllTicketsAction(),
          getAllEmployeesAction(),
          getAllSupervisorsAction(),
        ]);
        setAllTickets(tickets);
        setAllEmployees(employees);
        setAllSupervisors(supervisors);
      } catch (error) {
        console.error("Failed to load ticket data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ProtectedPage allowedRoles={['IS', 'NS', 'DH', 'IC Head']}>
      {(currentUser: User) => {
        const currentSupervisorUser = currentUser as Supervisor;
        
        return (
            <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8 space-y-6">
              <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <h1 className="font-headline text-2xl md:text-3xl font-bold">Manage Tickets ({currentSupervisorUser.title})</h1>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/reports"><Filter className="mr-2 h-4 w-4" /> Go to Reports</Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={100}>
                <Card className="shadow-lg transition-shadow hover:shadow-xl">
                    <CardHeader>
                        <CardTitle>Filter Tickets</CardTitle>
                        <CardDescription>Search by keyword or filter by status/priority.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Input 
                            placeholder="Search by Ticket ID, PSN, Name, Query..."
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="md:col-span-1"
                        />
                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Ticket['status'] | "all")}>
                            <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {['Open', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Escalated to NS', 'Escalated to DH', 'Escalated to IC Head'].map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Ticket['priority'] | "all")}>
                            <SelectTrigger><SelectValue placeholder="Filter by Priority" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
              </ScrollReveal>

                {isLoading ? (
                    <div className="flex flex-col justify-center items-center py-10">
                        <LoadingSpinner />
                        <p className="mt-2">Loading Tickets...</p>
                    </div>
                ) : (
                    <SupervisorTicketsPageContent
                        currentUser={currentSupervisorUser}
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                        priorityFilter={priorityFilter}
                        allTickets={allTickets}
                        allEmployees={allEmployees}
                        allSupervisors={allSupervisors}
                    />
                )}
            </div>
        );
      }}
    </ProtectedPage>
  );
}
