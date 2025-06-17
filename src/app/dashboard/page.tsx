"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Ticket, HR, Employee } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mockTickets, mockEmployees, mockHRs } from "@/data/mockData";
import { FileText, PlusCircle, Users, BarChart2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const getStatusBadgeVariant = (status: Ticket['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Open': return 'destructive';
    case 'In Progress': return 'default'; // primary
    case 'Pending': return 'outline'; // yellow-ish via custom styles if needed, or default outline
    case 'Resolved': case 'Closed': return 'secondary'; // green-ish, use secondary
    case 'Escalated': return 'default'; // primary or specific color
    default: return 'outline';
  }
};

const EmployeeDashboard = ({ user }: { user: Employee }) => {
  const userTickets = mockTickets.filter(ticket => ticket.psn === user.psn);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-bold">My Tickets</h1>
        <Button asChild>
          <Link href="/tickets/new"><PlusCircle className="mr-2 h-4 w-4" /> Raise New Ticket</Link>
        </Button>
      </div>
      {userTickets.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Here's a list of tickets you've raised.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Query (Summary)</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Raised</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userTickets.slice(0, 5).map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.query.substring(0, 50)}...</TableCell>
                    <TableCell><Badge variant={ticket.priority === "Urgent" || ticket.priority === "High" ? "destructive" : "secondary"}>{ticket.priority}</Badge></TableCell>
                    <TableCell><Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge></TableCell>
                    <TableCell>{new Date(ticket.dateOfQuery).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/tickets/${ticket.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
           {userTickets.length > 5 && (
            <CardFooter>
                <Button variant="link" asChild><Link href="/employee/tickets">View All My Tickets</Link></Button>
            </CardFooter>
           )}
        </Card>
      ) : (
        <Card className="text-center py-8">
            <CardContent>
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You haven't raised any tickets yet.</p>
                <Button asChild className="mt-4">
                    <Link href="/tickets/new">Raise Your First Ticket</Link>
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
};

const HRDashboard = ({ user }: { user: HR }) => {
  // HRs see tickets related to their projects, Head HR sees all
  const relevantTickets = user.role === 'Head HR' 
    ? mockTickets 
    : mockTickets.filter(ticket => user.projectsHandled.some(p => p.id === ticket.project));
  
  const openTickets = relevantTickets.filter(t => t.status === 'Open' || t.status === 'In Progress' || t.status === 'Pending').length;
  const resolvedToday = relevantTickets.filter(t => t.status === 'Resolved' && t.dateOfResponse && new Date(t.dateOfResponse).toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold">HR Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
            <p className="text-xs text-muted-foreground">Tickets requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedToday}</div>
            <p className="text-xs text-muted-foreground">Tickets closed today</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {/* This would be dynamic in a real app */}
            <div className="text-2xl font-bold">{mockEmployees.length}</div>
            <p className="text-xs text-muted-foreground">Employees in the system</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline" asChild><Link href="/admin/add-employee"><PlusCircle className="mr-2 h-4 w-4" /> Add New Employee</Link></Button>
                <Button className="w-full justify-start" variant="outline" asChild><Link href="/admin/add-hr"><Users className="mr-2 h-4 w-4" /> Add New HR</Link></Button>
                <Button className="w-full justify-start" variant="outline" asChild><Link href="/reports"><BarChart2 className="mr-2 h-4 w-4" /> Generate Reports</Link></Button>
            </CardContent>
         </Card>
         <Card>
            <CardHeader>
                <CardTitle>Recent High Priority Tickets</CardTitle>
                <CardDescription>Top open tickets needing urgent attention.</CardDescription>
            </CardHeader>
            <CardContent>
                {relevantTickets.filter(t => (t.priority === 'Urgent' || t.priority === 'High') && (t.status === 'Open' || t.status === 'In Progress')).slice(0,3).map(ticket => (
                    <div key={ticket.id} className="mb-3 pb-3 border-b last:border-b-0">
                        <div className="flex justify-between items-start">
                           <h4 className="font-semibold">{ticket.query.substring(0,40)}...</h4>
                           <Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">ID: {ticket.id} | Raised by: {ticket.employeeName} ({ticket.psn})</p>
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                            <Link href={`/tickets/${ticket.id}`}>View Details</Link>
                        </Button>
                    </div>
                ))}
                {relevantTickets.filter(t => (t.priority === 'Urgent' || t.priority === 'High') && (t.status === 'Open' || t.status === 'In Progress')).length === 0 && (
                    <p className="text-sm text-muted-foreground">No high priority tickets currently open.</p>
                )}
            </CardContent>
             <CardFooter>
                <Button variant="outline" className="w-full" asChild><Link href="/hr/tickets">View All Tickets</Link></Button>
            </CardFooter>
         </Card>
      </div>
    </div>
  );
};
import { CheckCircle } from "lucide-react"; // Import CheckCircle

export default function DashboardPage() {
  return (
    <ProtectedPage>
      {(user: User) => (
        <div>
          {user.role === 'Employee' && <EmployeeDashboard user={user as Employee} />}
          {(user.role === 'HR' || user.role === 'Head HR') && <HRDashboard user={user as HR} />}
        </div>
      )}
    </ProtectedPage>
  );
}
