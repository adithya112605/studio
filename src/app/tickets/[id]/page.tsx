
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Ticket, Employee, Supervisor, TicketStatus, JobCode } from "@/types";
import { mockTickets, mockEmployees, mockSupervisors, mockProjects, mockJobCodes } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TicketResolutionSuggestions from "@/components/hr/TicketResolutionSuggestions"; // Will rename this folder later if needed
import Link from "next/link";
import { ArrowLeft, Edit3, Send, AlertTriangle, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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

const TicketDetailPage = ({ params }: { params: { id: string } }) => {
  const ticketId = params.id;
  const { toast } = useToast();
  const router = useRouter();
  
  const [ticket, setTicket] = useState<Ticket | undefined>(() => mockTickets.find(t => t.id === ticketId));
  const [employeeDetails, setEmployeeDetails] = useState<Employee | undefined>(undefined);
  const [jobCodeDetails, setJobCodeDetails] = useState<JobCode | undefined>(undefined);
  const [currentAssignee, setCurrentAssignee] = useState<Supervisor | undefined>(undefined);

  const [supervisorResponse, setSupervisorResponse] = useState("");
  const [newStatus, setNewStatus] = useState<TicketStatus | undefined>(ticket?.status);
  const [employeeFollowUp, setEmployeeFollowUp] = useState("");

  useEffect(() => {
    if (ticket) {
      const emp = mockEmployees.find(e => e.psn === ticket.psn);
      setEmployeeDetails(emp);
      if (emp) {
        setJobCodeDetails(mockJobCodes.find(jc => jc.id === emp.jobCodeId));
      }
      setCurrentAssignee(mockSupervisors.find(s => s.psn === ticket.currentAssigneePSN));
      setNewStatus(ticket.status); // Initialize newStatus with ticket's current status
    }
  }, [ticket]);


  if (!ticket || !employeeDetails) {
    return (
      <ProtectedPage>
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold">Ticket Not Found</h1>
          <p className="text-muted-foreground">The ticket ID <span className="font-mono">{ticketId}</span> does not exist or essential details are missing.</p>
          <Button asChild className="mt-6">
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
          </Button>
        </div>
      </ProtectedPage>
    );
  }

  const handleSupervisorUpdate = () => {
    if (!newStatus && !supervisorResponse) {
        toast({title: "No Changes", description: "Please provide a response or select a new status.", variant: "default"});
        return;
    }
    if (!ticket) return;

    const updatedTicketData = {
      ...ticket,
      status: newStatus || ticket.status,
      actionPerformed: supervisorResponse
        ? `${ticket.actionPerformed || ''}\n---\nSupervisor (${new Date().toLocaleString()}):\n${supervisorResponse}`.trim()
        : ticket.actionPerformed,
      dateOfResponse: supervisorResponse || newStatus ? new Date().toISOString() : ticket.dateOfResponse,
    };
    
    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex > -1) mockTickets[ticketIndex] = updatedTicketData;
    setTicket(updatedTicketData);
    setSupervisorResponse("");
    // setNewStatus(updatedTicketData.status); // Keep newStatus if it was set, or update from ticket

    toast({title: "Ticket Updated", description: `Status changed to ${updatedTicketData.status}. Response added.`});
  };
  
  const handleEscalate = (currentUser: Supervisor) => {
    if (!ticket || !employeeDetails) return;
    let nextAssigneePSN: number | undefined;
    let nextStatus: TicketStatus | undefined;

    switch (currentUser.functionalRole) {
      case 'IS':
        nextAssigneePSN = employeeDetails.nsPSN;
        nextStatus = 'Escalated to NS';
        if (!nextAssigneePSN) { // If no NS, escalate to DH
          nextAssigneePSN = employeeDetails.dhPSN;
          nextStatus = 'Escalated to DH';
        }
        if (!nextAssigneePSN) { // If no DH, escalate to IC Head
             const icHead = mockSupervisors.find(s => s.functionalRole === 'IC Head');
             nextAssigneePSN = icHead?.psn;
             nextStatus = 'Escalated to IC Head';
        }
        break;
      case 'NS':
        nextAssigneePSN = employeeDetails.dhPSN;
        nextStatus = 'Escalated to DH';
         if (!nextAssigneePSN) { // If no DH, escalate to IC Head
             const icHead = mockSupervisors.find(s => s.functionalRole === 'IC Head');
             nextAssigneePSN = icHead?.psn;
             nextStatus = 'Escalated to IC Head';
        }
        break;
      case 'DH':
        const icHead = mockSupervisors.find(s => s.functionalRole === 'IC Head');
        nextAssigneePSN = icHead?.psn;
        nextStatus = 'Escalated to IC Head';
        break;
      default:
        toast({title: "Escalation Error", description: "Cannot escalate further from this role.", variant: "destructive"});
        return;
    }

    if (!nextAssigneePSN || !nextStatus) {
      toast({title: "Escalation Error", description: "Next supervisor level not found.", variant: "destructive"});
      return;
    }

    const updatedTicket = {
        ...ticket,
        status: nextStatus,
        currentAssigneePSN: nextAssigneePSN,
        actionPerformed: `${ticket.actionPerformed || ''}\n---\n${new Date().toLocaleString()}: Escalated by ${currentUser.name} (${currentUser.psn}) to next level.`.trim(),
    };
    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex > -1) mockTickets[ticketIndex] = updatedTicket;
    setTicket(updatedTicket);
    setNewStatus(nextStatus);
    toast({ title: "Ticket Escalated", description: `Ticket ${ticketId} has been escalated to ${nextStatus.replace('Escalated to ', '')}.` });
  };

  const handleAddEmployeeFollowUp = () => {
    if (!employeeFollowUp.trim()) {
      toast({ title: "No Information", description: "Please enter your follow-up information.", variant: "default" });
      return;
    }
    if (!ticket) return;

    const updatedTicketData = {
      ...ticket,
      followUpQuery: `${ticket.followUpQuery || ''}\n---\nEmployee (${new Date().toLocaleString()}):\n${employeeFollowUp}`.trim(),
      actionPerformed: `${ticket.actionPerformed || ''}\n---\nEmployee Follow-up (${new Date().toLocaleString()}):\n${employeeFollowUp}`.trim(),
    };

    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex > -1) mockTickets[ticketIndex] = updatedTicketData;
    setTicket(updatedTicketData);
    setEmployeeFollowUp("");
    toast({ title: "Information Added", description: "Your follow-up has been added to the ticket." });
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
                  <p><strong>PSN:</strong> {employeeDetails.psn}</p>
                  <p><strong>Name:</strong> {employeeDetails.name}</p>
                  <p><strong>Business Email:</strong> {employeeDetails.businessEmail || 'N/A'}</p>
                  <p><strong>Project:</strong> {mockProjects.find(p => p.id === employeeDetails.project)?.name || employeeDetails.project}</p>
                  <p><strong>Job Code:</strong> {jobCodeDetails?.code} ({jobCodeDetails?.description})</p>
                  <p><strong>Grade:</strong> {employeeDetails.grade}</p>
                  <p><strong>IS:</strong> {employeeDetails.isName} ({employeeDetails.isPSN})</p>
                  <p><strong>NS:</strong> {employeeDetails.nsName} ({employeeDetails.nsPSN})</p>
                  <p><strong>DH:</strong> {employeeDetails.dhName} ({employeeDetails.dhPSN})</p>
                </div>
              </div>
              <hr/>
              <div>
                <h3 className="font-semibold text-lg mb-2">Query Details</h3>
                <p><strong>Priority:</strong> <Badge variant={ticket.priority === "Urgent" || ticket.priority === "High" ? "destructive" : "secondary"}>{ticket.priority}</Badge></p>
                <p className="mt-2 whitespace-pre-wrap"><strong>Initial Query:</strong> {ticket.query}</p>
                {ticket.followUpQuery && <p className="mt-2 whitespace-pre-wrap"><strong>Follow-ups:</strong> {ticket.followUpQuery}</p>}
              </div>
              
              {(ticket.actionPerformed || ticket.dateOfResponse) && (<hr/>)}

              {ticket.actionPerformed && (
                <div>
                    <h3 className="font-semibold text-lg mb-2">Actions Log / Responses</h3>
                    <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md overflow-x-auto">{ticket.actionPerformed}</pre>
                </div>
              )}
              {ticket.dateOfResponse && <p className="text-sm text-muted-foreground"><strong>Last Response Date:</strong> {new Date(ticket.dateOfResponse).toLocaleString()}</p>}
             
              {currentAssignee && (
                <div>
                    <p className="text-sm text-muted-foreground"><strong>Currently Assigned Supervisor:</strong> {currentAssignee.name} ({currentAssignee.psn}) - {currentAssignee.title}</p>
                </div>
              )}

            </CardContent>
          </Card>

          {(user.role === 'IS' || user.role === 'NS' || user.role === 'DH' || user.role === 'IC Head') && 
           (user.psn === ticket.currentAssigneePSN || (user as Supervisor).functionalRole === 'IC Head' || ((user as Supervisor).functionalRole === 'DH' && employeeDetails?.dhPSN === user.psn && ticket.status.startsWith('Escalated to DH')) ) &&
           !['Resolved', 'Closed'].includes(ticket.status) &&
           (
            <>
              <TicketResolutionSuggestions ticketQuery={ticket.query} />

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Manage Ticket</CardTitle>
                  <CardDescription>Respond to the employee or update the ticket status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="supervisorResponse">Your Response / Action Taken</Label>
                    <Textarea 
                      id="supervisorResponse" 
                      value={supervisorResponse}
                      onChange={(e) => setSupervisorResponse(e.target.value)}
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
                  <Button onClick={handleSupervisorUpdate}>
                    <Send className="mr-2 h-4 w-4" /> Update Ticket
                  </Button>
                  { (user as Supervisor).functionalRole !== 'IC Head' && !ticket.status.startsWith('Escalated to IC Head') && (
                     <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleEscalate(user as Supervisor)}>
                        <ShieldAlert className="mr-2 h-4 w-4"/> Escalate
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </>
          )}

          {user.role === 'Employee' && !['Resolved', 'Closed'].includes(ticket.status) && (
             <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Add Follow-up Information</CardTitle>
                   <CardDescription>If you have more details to add, please provide them here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                      placeholder="Type additional information or a follow-up here..." 
                      rows={3}
                      value={employeeFollowUp}
                      onChange={(e) => setEmployeeFollowUp(e.target.value)}
                    />
                </CardContent>
                <CardFooter>
                    <Button onClick={handleAddEmployeeFollowUp}><Edit3 className="mr-2 h-4 w-4" /> Add Information</Button>
                </CardFooter>
             </Card>
          )}
        </div>
      )}
    </ProtectedPage>
  );
};

export default TicketDetailPage;
