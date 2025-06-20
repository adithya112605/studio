
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Ticket, Supervisor, Employee, JobCode } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mockTickets, mockEmployees, mockSupervisors, mockJobCodes, mockProjects } from "@/data/mockData";
import { FileText, PlusCircle, Users, BarChart2, CheckCircle, UserSquare2, Eye, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/common/ScrollReveal";

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

const EmployeeDashboard = ({ user }: { user: Employee }) => {
  const userTickets = mockTickets.filter(ticket => ticket.psn === user.psn);
  const jobCode = mockJobCodes.find(jc => jc.id === user.jobCodeId);

  return (
    <div className="space-y-6">
      <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
        <div className="flex justify-between items-center">
          <h1 className="font-headline text-3xl font-bold">My Dashboard</h1>
        </div>
      </ScrollReveal>
      <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={100}>
       <Card className="transition-all duration-300 ease-in-out hover:shadow-xl dark:hover:shadow-primary/20 hover:-translate-y-1">
        <CardHeader><CardTitle>My Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p><strong>PSN:</strong> {user.psn}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Business Email:</strong> {user.businessEmail}</p>
          <p><strong>Project:</strong> {mockProjects.find(p => p.id === user.project)?.name || user.project}</p>
          <p><strong>Job Code:</strong> {jobCode?.code} ({jobCode?.description})</p>
          <p><strong>Grade:</strong> {user.grade}</p>
          <p><strong>Immediate Supervisor (IS):</strong> {user.isName || 'N/A'} ({user.isPSN || 'N/A'})</p>
          <p><strong>Next Level Supervisor (NS):</strong> {user.nsName || 'N/A'} ({user.nsPSN || 'N/A'})</p>
          <p><strong>Department Head (DH):</strong> {user.dhName || 'N/A'} ({user.dhPSN || 'N/A'})</p>
        </CardContent>
      </Card>
      </ScrollReveal>

      <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={200}>
        <div className="flex justify-between items-center mt-6">
          <h2 className="font-headline text-2xl font-bold">My Tickets</h2>
          <Button asChild>
            <Link href="/tickets/new"><PlusCircle className="mr-2 h-4 w-4" /> Raise New Ticket</Link>
          </Button>
        </div>
      </ScrollReveal>
      <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={300}>
      {userTickets.length > 0 ? (
        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl dark:hover:shadow-primary/20 hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Here's a list of tickets you've raised.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
            </div>
          </CardContent>
           {userTickets.length > 5 && (
            <CardFooter>
                <Button variant="link" asChild><Link href="/employee/tickets">View All My Tickets <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </CardFooter>
           )}
        </Card>
      ) : (
        <Card className="text-center py-8 transition-all duration-300 ease-in-out hover:shadow-xl dark:hover:shadow-primary/20 hover:-translate-y-1">
            <CardContent>
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You haven't raised any tickets yet.</p>
                <Button asChild className="mt-4">
                    <Link href="/tickets/new">Raise Your First Ticket</Link>
                </Button>
            </CardContent>
        </Card>
      )}
      </ScrollReveal>
    </div>
  );
};

const SupervisorDashboard = ({ user }: { user: Supervisor }) => {
  let relevantTickets: Ticket[] = [];
  let managedEmployees: Employee[] = [];

  if (user.functionalRole === 'IC Head') {
    relevantTickets = mockTickets;
    managedEmployees = mockEmployees;
  } else if (user.functionalRole === 'DH') {
    const dhProjects = mockProjects.filter(p => user.cityAccess?.includes(p.city));
    const dhProjectIds = dhProjects.map(p => p.id);
    relevantTickets = mockTickets.filter(ticket => dhProjectIds.includes(ticket.project));
    managedEmployees = mockEmployees.filter(emp => emp.dhPSN === user.psn || (emp.project && dhProjectIds.includes(emp.project)));
  } else if (user.functionalRole === 'NS') {
    relevantTickets = mockTickets.filter(ticket => 
        (mockEmployees.find(e => e.psn === ticket.psn)?.nsPSN === user.psn) || ticket.currentAssigneePSN === user.psn
    );
    managedEmployees = mockEmployees.filter(emp => emp.nsPSN === user.psn);
  } else if (user.functionalRole === 'IS') {
    relevantTickets = mockTickets.filter(ticket => 
        (mockEmployees.find(e => e.psn === ticket.psn)?.isPSN === user.psn) || ticket.currentAssigneePSN === user.psn
    );
     managedEmployees = mockEmployees.filter(emp => emp.isPSN === user.psn);
  }
  
  const openTicketsCount = relevantTickets.filter(t => ['Open', 'In Progress', 'Pending', 'Escalated to NS', 'Escalated to DH', 'Escalated to IC Head'].includes(t.status)).length;
  const resolvedTodayCount = relevantTickets.filter(t => t.status === 'Resolved' && t.dateOfResponse && new Date(t.dateOfResponse).toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-8">
      <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
        <h1 className="font-headline text-3xl font-bold">{user.title} Dashboard</h1>
      </ScrollReveal>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Active Tickets", value: openTicketsCount, icon: <FileText className="h-4 w-4 text-muted-foreground" />, desc: "Tickets requiring attention" },
          { title: "Resolved Today", value: resolvedTodayCount, icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />, desc: "Tickets closed today" },
          { title: "Total Employees", value: mockEmployees.length, icon: <Users className="h-4 w-4 text-muted-foreground" />, desc: "Employees in the system" }
        ].map((item, index) => (
          <ScrollReveal key={item.title} animationInClass="animate-fadeInUp" once={false} delayIn={100 + index * 100}>
            <Card className="shadow-md hover:shadow-xl dark:hover:shadow-primary/20 transform transition-all duration-300 ease-in-out hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={400}>
         <Card className="shadow-md hover:shadow-xl dark:hover:shadow-accent/20 transform transition-all duration-300 ease-in-out hover:-translate-y-1">
            <CardHeader> <CardTitle className="font-headline text-xl">Quick Actions</CardTitle> </CardHeader>
            <CardContent className="space-y-3">
                {(user.functionalRole === 'DH' || user.functionalRole === 'IC Head') && (
                  <>
                    <Button className="w-full justify-start text-left" variant="outline" asChild><Link href="/admin/add-employee"><PlusCircle className="mr-2 h-5 w-5" /> Add New Employee</Link></Button>
                    <Button className="w-full justify-start text-left" variant="outline" asChild><Link href="/admin/add-supervisor"><UserSquare2 className="mr-2 h-5 w-5" /> Add New Supervisor</Link></Button>
                  </>
                )}
                <Button className="w-full justify-start text-left" variant="outline" asChild><Link href="/supervisor/employee-details"><Eye className="mr-2 h-5 w-5" /> View Employee Details</Link></Button>
                <Button className="w-full justify-start text-left" variant="outline" asChild><Link href="/reports"><BarChart2 className="mr-2 h-5 w-5" /> Generate Reports</Link></Button>
            </CardContent>
         </Card>
        </ScrollReveal>
        <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={500}>
         <Card className="shadow-md hover:shadow-xl dark:hover:shadow-destructive/20 transform transition-all duration-300 ease-in-out hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Recent High Priority Tickets</CardTitle>
                <CardDescription>Top open tickets needing urgent attention.</CardDescription>
            </CardHeader>
            <CardContent>
                {relevantTickets.filter(t => (t.priority === 'Urgent' || t.priority === 'High') && !['Resolved', 'Closed'].includes(t.status)).slice(0,3).map(ticket => (
                    <div key={ticket.id} className="mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-semibold">{ticket.query.substring(0,40)}...</h4>
                           <Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">ID: {ticket.id} | Raised by: {ticket.employeeName} ({ticket.psn})</p>
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-primary hover:underline" asChild>
                            <Link href={`/tickets/${ticket.id}`}>View Details</Link>
                        </Button>
                    </div>
                ))}
                {relevantTickets.filter(t => (t.priority === 'Urgent' || t.priority === 'High') && !['Resolved', 'Closed'].includes(t.status)).length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 text-center">No high priority tickets currently open.</p>
                )}
            </CardContent>
             <CardFooter>
                <Button variant="outline" className="w-full" asChild><Link href="/hr/tickets">View All Tickets <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </CardFooter>
         </Card>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <ProtectedPage>
      {(user: User) => (
        <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
          {user.role === 'Employee' && <EmployeeDashboard user={user as Employee} />}
          {(user.role === 'IS' || user.role === 'NS' || user.role === 'DH' || user.role === 'IC Head') && <SupervisorDashboard user={user as Supervisor} />}
        </div>
      )}
    </ProtectedPage>
  );
}
