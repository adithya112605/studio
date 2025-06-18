"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Ticket, Employee, HR, TicketStatus } from "@/types";
import { mockTickets, mockEmployees, mockHRs, mockProjects // Import mockProjects
} from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TicketResolutionSuggestions from "@/components/hr/TicketResolutionSuggestions";
import Link from "next/link";
import { ArrowLeft, Edit3, Send, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const getStatusBadgeVariant = (status: Ticket['status']): "default" | "secondary" | "destructive" | "outline" => {
   switch (status) {
    case 'Open': return 'destructive';
    case 'In Progress': return 'default'; 
    case 'Pending': return 'outline'; 
    case 'Resolved': case 'Closed': return 'secondary';
    case 'Escalated': return 'default'; 
    default: return 'outline';
  }
};

const TicketDetailPage = ({ params }: { params: { id: string } }) => {
  const ticketId = params.id;
  const [ticket, setTicket] = useState<Ticket | undefined>(mockTickets.find(t => t.id === ticketId));
  const [hrResponse, setHrResponse] = useState("");
  const [newStatus, setNewStatus] = useState<TicketStatus | undefined>(ticket?.status);
  const { toast } = useToast();
  const router = useRouter();


  if (!ticket) {
    return (
      <ProtectedPage>
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold">Ticket Not Found</h1>
          <p className="text-muted-foreground">The ticket ID <span className="font-mono">{ticketId}</span> does not exist or you may not have permission to view it.</p>
          <Button asChild className="mt-6">
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
          </Button>
        </div>
      </ProtectedPage>
    );
  }

  const employee = mockEmployees.find(e => e.psn === ticket.psn);
  const assignedHR = mockHRs.find(h => h.psn === ticket.hrPSNAssigned);
  const escalatedToHR = ticket.escalatedToPSN ? mockHRs.find(h => h.psn === ticket.escalatedToPSN) : null;

  const handleHRUpdate = () => {
    if (!newStatus) {
        toast({title: "Error", description: "Please select a new status.", variant: "destructive"});
        return;
    }
    const updatedTicket = {
      ...ticket,
      status: newStatus,
      actionPerformed: hrResponse ? (ticket.actionPerformed ? `${ticket.actionPerformed}\n---\n${new Date().toLocaleString()}:\n${hrResponse}` : `${new Date().toLocaleString()}:\n${hrResponse}`) : ticket.actionPerformed,
      dateOfResponse: new Date().toISOString(),
    };
    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex > -1) mockTickets[ticketIndex] = updatedTicket;
    setTicket(updatedTicket);
    setHrResponse("");

    toast({title: "Ticket Updated", description: `Status changed to ${newStatus}. Response added.`});
  };
  
  const handleEscalate = (headHrPsn: number) => { // headHrPsn changed to number
    if (!ticket) return;
    const updatedTicket = {
        ...ticket,
        status: 'Escalated' as TicketStatus,
        escalatedToPSN: headHrPsn,
        actionPerformed: `${ticket.actionPerformed || ''}\n---\n${new Date().toLocaleString()}: Escalated to Head HR (${headHrPsn}).`,
    };
    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex > -1) mockTickets[ticketIndex] = updatedTicket;
    setTicket(updatedTicket);
    toast({ title: "Ticket Escalated", description: `Ticket ${ticketId} has been escalated.` });
  };


  return (
    <ProtectedPage>
      {(user: User) => (
        <div className="space-y-8 max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-3xl mb-1">Ticket: {ticket.id}</CardTitle>
                  <CardDescription>Details for ticket raised on {new Date(ticket.dateOfQuery).toLocaleDateString()}.</CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(ticket.status)} className="text-lg px-4 py-1">{ticket.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Employee Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p><strong>PSN:</strong> {ticket.psn}</p>
                  <p><strong>Name:</strong> {ticket.employeeName}</p>
                  <p><strong>Project:</strong> {mockProjects.find(p => p.id === ticket.project)?.name || ticket.project}</p>
                  <p><strong>Grade:</strong> {employee?.grade || 'N/A'}</p>
                </div>
              </div>
              <hr/>
              <div>
                <h3 className="font-semibold text-lg mb-2">Query Details</h3>
                <p><strong>Priority:</strong> <Badge variant={ticket.priority === "Urgent" || ticket.priority === "High" ? "destructive" : "secondary"}>{ticket.priority}</Badge></p>
                <p className="mt-2 whitespace-pre-wrap"><strong>Query:</strong> {ticket.query}</p>
                {ticket.followUpQuery && <p className="mt-2 whitespace-pre-wrap"><strong>Follow-up:</strong> {ticket.followUpQuery}</p>}
              </div>
              
              {(ticket.actionPerformed || ticket.dateOfResponse) && (<hr/>)}

              {ticket.actionPerformed && (
                <div>
                    <h3 className="font-semibold text-lg mb-2">Actions Log / Responses</h3>
                    <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{ticket.actionPerformed}</p>
                </div>
              )}
              {ticket.dateOfResponse && <p className="text-sm text-muted-foreground"><strong>Last Response Date:</strong> {new Date(ticket.dateOfResponse).toLocaleString()}</p>}
             
              {assignedHR && (
                <div>
                    <p className="text-sm text-muted-foreground"><strong>Assigned HR:</strong> {assignedHR.name} ({assignedHR.psn})</p>
                </div>
              )}
               {escalatedToHR && (
                <div>
                    <p className="text-sm text-destructive font-semibold"><strong>Escalated To:</strong> {escalatedToHR.name} ({escalatedToHR.psn})</p>
                </div>
              )}


            </CardContent>
          </Card>

          {(user.role === 'HR' || user.role === 'Head HR') && (
            <>
              <TicketResolutionSuggestions ticketQuery={ticket.query} />

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Manage Ticket</CardTitle>
                  <CardDescription>Respond to the employee or update the ticket status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hrResponse">Your Response / Action Taken</Label>
                    <Textarea 
                      id="hrResponse" 
                      value={hrResponse}
                      onChange={(e) => setHrResponse(e.target.value)}
                      placeholder="Enter your response or actions taken..." 
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newStatus">Update Status</Label>
                    <Select value={newStatus} onValueChange={(value) => setNewStatus(value as TicketStatus)}>
                      <SelectTrigger id="newStatus">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {(['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'] as TicketStatus[]).map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={handleHRUpdate} disabled={!newStatus && !hrResponse}>
                    <Send className="mr-2 h-4 w-4" /> Update Ticket
                  </Button>
                  {user.role === 'HR' && ticket.status !== 'Escalated' && (
                     <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => {
                        const headHRAccount = mockHRs.find(hr => hr.role === 'Head HR');
                        if (headHRAccount) {
                            handleEscalate(headHRAccount.psn);
                        } else {
                            toast({title: "Error", description: "Head HR account not found for escalation.", variant: "destructive"});
                        }
                     }}>
                        <AlertTriangle className="mr-2 h-4 w-4"/> Escalate to Head HR
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </>
          )}

          {user.role === 'Employee' && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
             <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Add Follow-up Information</CardTitle>
                   <CardDescription>If you have more details to add, please provide them here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea placeholder="Type additional information or a follow-up here..." rows={3}/>
                </CardContent>
                <CardFooter>
                    <Button disabled><Edit3 className="mr-2 h-4 w-4" /> Add Information (Not Implemented)</Button>
                </CardFooter>
             </Card>
          )}
        </div>
      )}
    </ProtectedPage>
  );
};

export default TicketDetailPage;
