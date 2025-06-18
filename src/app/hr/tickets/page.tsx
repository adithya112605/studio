
"use client";

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Ticket, HR } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mockTickets } from "@/data/mockData";
import { FileText, ArrowLeft, Filter } from "lucide-react";
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

export default function HrTicketsPage() {
  // Removed top-level useAuth and user-specific data derivation

  return (
    <ProtectedPage allowedRoles={['HR', 'Head HR']}>
      {(currentUser: User) => {
        // currentUser is guaranteed by ProtectedPage to be HR or Head HR
        const currentHrUser = currentUser as HR;
        const currentRelevantTickets = currentHrUser.role === 'Head HR' 
            ? mockTickets 
            : mockTickets.filter(ticket => currentHrUser.projectsHandled.some(p => p.id === ticket.project));
        
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                <h1 className="font-headline text-3xl font-bold">Manage All Tickets</h1>
                <Button variant="outline" asChild>
                    <Link href="/reports"><Filter className="mr-2 h-4 w-4" /> Go to Reports & Filters</Link>
                </Button>
                </div>
                 <div className="mb-4">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard</Link>
                    </Button>
                </div>

                {currentRelevantTickets.length > 0 ? (
                <Card className="shadow-lg">
                    <CardHeader>
                    <CardTitle>Ticket Queue</CardTitle>
                    <CardDescription>A complete list of tickets relevant to your scope.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Ticket ID</TableHead>
                            <TableHead>Employee</TableHead>
                            <TableHead>Query (Summary)</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Raised</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {currentRelevantTickets.map(ticket => (
                            <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>{ticket.employeeName} ({ticket.psn})</TableCell>
                            <TableCell>{ticket.query.substring(0, 50)}...</TableCell>
                            <TableCell><Badge variant={ticket.priority === "Urgent" || ticket.priority === "High" ? "destructive" : "secondary"}>{ticket.priority}</Badge></TableCell>
                            <TableCell><Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge></TableCell>
                            <TableCell>{new Date(ticket.dateOfQuery).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" asChild>
                                <Link href={`/tickets/${ticket.id}`}>View / Manage</Link>
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
                        <p className="text-muted-foreground">No tickets found in your queue.</p>
                    </CardContent>
                </Card>
                )}
            </div>
        );
      }}
    </ProtectedPage>
  );
}
