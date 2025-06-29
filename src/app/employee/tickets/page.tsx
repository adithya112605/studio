
"use client";

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Ticket, Employee } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, PlusCircle, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/common/ScrollReveal";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getTicketsByEmployeePsnAction } from "@/lib/actions";

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

export default function EmployeeTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ProtectedPage allowedRoles={['Employee', 'IS', 'NS', 'DH', 'IC Head']}>
      {(currentUser: User) => {
          const currentEmployeeUser = currentUser as Employee;
          
          useEffect(() => {
              const fetchTickets = async () => {
                  setIsLoading(true);
                  try {
                      const userTickets = await getTicketsByEmployeePsnAction(currentEmployeeUser.psn);
                      setTickets(userTickets);
                  } catch (error) {
                      console.error("Failed to fetch tickets:", error);
                  } finally {
                      setIsLoading(false);
                  }
              };
              if (currentEmployeeUser) {
                  fetchTickets();
              }
          }, [currentEmployeeUser]);


          return (
            <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8 space-y-6">
              <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
                <div className="flex justify-between items-center">
                  <h1 className="font-headline text-3xl font-normal tracking-wide">All My Tickets</h1>
                  <Button asChild>
                      <Link href="/tickets/new"><PlusCircle className="mr-2 h-4 w-4" /> Raise New Ticket</Link>
                  </Button>
                </div>
              </ScrollReveal>
              <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={100}>
                <div className="mb-4">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard</Link>
                    </Button>
                </div>
              </ScrollReveal>
              
              {isLoading ? (
                 <div className="flex flex-col justify-center items-center py-10">
                    <LoadingSpinner />
                    <p className="mt-2">Loading Your Tickets...</p>
                 </div>
              ) : (
                <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={200}>
                  {tickets.length > 0 ? (
                  <Card className="shadow-lg transition-shadow hover:shadow-xl">
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
                          {tickets.map(ticket => (
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
                  <Card className="text-center py-8 shadow-lg transition-shadow hover:shadow-xl">
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
              )}
            </div>
          );
      }}
    </ProtectedPage>
  );
}
