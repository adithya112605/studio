
"use client";

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Ticket, Employee } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mockTickets } from "@/data/mockData";
import { FileText, PlusCircle, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// Removed: import { useAuth } from "@/contexts/AuthContext";

// Duplicated from dashboard/page.tsx - consider moving to utils
const getStatusBadgeVariant = (status: Ticket['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Open': return 'destructive';
    case 'In Progress': return 'default'; // primary
    case 'Pending': return 'outline'; 
    case 'Resolved': case 'Closed': return 'secondary';
    case 'Escalated': return 'default'; 
    default: return 'outline';
  }
};

export default function EmployeeTicketsPage() {
  // Removed top-level useAuth and user-specific data derivation

  return (
    <ProtectedPage allowedRoles={['Employee']}>
      {(currentUser: User) => {
          // currentUser is guaranteed by ProtectedPage to be an Employee
          const currentEmployeeUser = currentUser as Employee;
          const currentUserTickets = mockTickets.filter(ticket => ticket.psn === currentEmployeeUser.psn);

          return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                <h1 className="font-headline text-3xl font-bold">All My Tickets</h1>
                <Button asChild>
                    <Link href="/tickets/new"><PlusCircle className="mr-2 h-4 w-4" /> Raise New Ticket</Link>
                </Button>
                </div>
                 <div className="mb-4">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard</Link>
                    </Button>
                </div>

                {currentUserTickets.length > 0 ? (
                <Card className="shadow-lg">
                    <CardHeader>
                    <CardTitle>My Ticket History</CardTitle>
                    <CardDescription>A complete list of tickets you've raised.</CardDescription>
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
                        {currentUserTickets.map(ticket => (
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
                </Card>
                ) : (
                <Card className="text-center py-8 shadow-lg">
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
      }}
    </ProtectedPage>
  );
}
