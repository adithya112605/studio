
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Ticket, Employee, Supervisor, TicketStatus, JobCode, TicketAttachment } from "@/types";
import { mockTickets, mockEmployees, mockSupervisors, mockProjects, mockJobCodes } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TicketResolutionSuggestions from "@/components/hr/TicketResolutionSuggestions";
import Link from "next/link";
import { AlertTriangle, ShieldAlert, Paperclip, ArrowLeft, Edit3, Send, Clock, BadgePercent } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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
  const supervisorResponseFileRef = useRef<HTMLInputElement>(null);
  const employeeFollowUpFileRef = useRef<HTMLInputElement>(null);

  const [ticket, setTicket] = useState<Ticket | undefined>(() => mockTickets.find(t => t.id === ticketId));
  const [employeeDetails, setEmployeeDetails] = useState<Employee | undefined>(undefined);
  const [jobCodeDetails, setJobCodeDetails] = useState<JobCode | undefined>(undefined);
  const [currentAssignee, setCurrentAssignee] = useState<Supervisor | undefined>(undefined);

  const [supervisorResponse, setSupervisorResponse] = useState("");
  const [newStatus, setNewStatus] = useState<TicketStatus | undefined>(ticket?.status);
  const [employeeFollowUp, setEmployeeFollowUp] = useState("");
  const [supervisorAttachments, setSupervisorAttachments] = useState<File[]>([]);
  const [employeeAttachments, setEmployeeAttachments] = useState<File[]>([]);


  useEffect(() => {
    if (ticket) {
      const emp = mockEmployees.find(e => e.psn === ticket.psn);
      setEmployeeDetails(emp);
      if (emp) {
        setJobCodeDetails(mockJobCodes.find(jc => jc.id === emp.jobCodeId));
      }
      setCurrentAssignee(mockSupervisors.find(s => s.psn === ticket.currentAssigneePSN));
      setNewStatus(ticket.status);
    }
  }, [ticket]);

  const overdueInfo = useMemo(() => {
    if (!ticket || !ticket.lastStatusUpdateDate || !employeeDetails) return null;

    const now = new Date();
    const lastUpdate = new Date(ticket.lastStatusUpdateDate);
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let deadlineDays = Infinity;
    let nextEscalationLevel = "";

    if (ticket.status === 'Open' && ticket.currentAssigneePSN === employeeDetails.isPSN) {
      deadlineDays = 2;
      nextEscalationLevel = employeeDetails.nsPSN ? "NS" : (employeeDetails.dhPSN ? "DH" : "IC Head");
    } else if (ticket.status === 'Escalated to NS' && ticket.currentAssigneePSN === employeeDetails.nsPSN) {
      deadlineDays = 1;
      nextEscalationLevel = employeeDetails.dhPSN ? "DH" : "IC Head";
    } else if (ticket.status === 'Escalated to DH' && ticket.currentAssigneePSN === employeeDetails.dhPSN) {
      deadlineDays = 1;
      nextEscalationLevel = "IC Head";
    }
    
    const isOverdue = diffDays > deadlineDays;
    return {
        isOverdue,
        daysOpen: diffDays.toFixed(0),
        deadlineDays,
        nextEscalationLevel,
    };
  }, [ticket, employeeDetails]);


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
  
  const handleAttachmentClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>, attachmentSetter: React.Dispatch<React.SetStateAction<File[]>>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      attachmentSetter(prev => [...prev, ...newFiles]);
      newFiles.forEach(file => {
          toast({
              title: "File Added (Mock)",
              description: `"${file.name}" is ready to be attached.`,
          });
      });
      if(event.target) event.target.value = ""; 
    }
  };
  
  const removeAttachment = (fileName: string, attachmentSetter: React.Dispatch<React.SetStateAction<File[]>>) => {
    attachmentSetter(prev => prev.filter(file => file.name !== fileName));
    toast({
        title: "File Removed",
        description: `"${fileName}" has been removed.`,
    });
  };

  const processAttachments = (files: File[], ticketId: string): TicketAttachment[] => {
    const currentDate = new Date().toISOString();
    return files.map((file, index) => ({
        id: `${ticketId}-att-${Date.now()}-${index}`, 
        fileName: file.name,
        fileType: file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' :
                    file.type.startsWith('audio/') ? 'audio' : 'document',
        urlOrContent: `mock/upload/path/${file.name}`, 
        uploadedAt: currentDate,
    }));
  };


  const handleSupervisorUpdate = () => {
    if (!newStatus && !supervisorResponse && supervisorAttachments.length === 0) {
        toast({title: "No Changes", description: "Please provide a response, select a new status, or add attachments.", variant: "default"});
        return;
    }
    if (!ticket) return;
    
    const newTicketAttachments = processAttachments(supervisorAttachments, ticket.id);
    const currentDate = new Date().toISOString();

    const updatedTicketData: Ticket = {
      ...ticket,
      status: newStatus || ticket.status,
      actionPerformed: supervisorResponse
        ? `${ticket.actionPerformed || ''}\n---\nSupervisor (${new Date(currentDate).toLocaleString()}):\n${supervisorResponse}`.trim()
        : ticket.actionPerformed,
      dateOfResponse: supervisorResponse || newStatus || newTicketAttachments.length > 0 ? currentDate : ticket.dateOfResponse,
      attachments: [...(ticket.attachments || []), ...newTicketAttachments],
      lastStatusUpdateDate: (newStatus && newStatus !== ticket.status) || supervisorResponse ? currentDate : ticket.lastStatusUpdateDate,
    };

    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex > -1) mockTickets[ticketIndex] = updatedTicketData;
    setTicket(updatedTicketData);
    setSupervisorResponse("");
    setSupervisorAttachments([]);

    toast({title: "Ticket Updated", description: `Status changed to ${updatedTicketData.status}. Response and/or attachments added.`});
  };

  const handleEscalate = (currentUser: Supervisor) => {
    if (!ticket || !employeeDetails) return;
    let nextAssigneePSN: number | undefined;
    let nextStatus: TicketStatus | undefined;
    const currentDate = new Date().toISOString();

    switch (currentUser.functionalRole) {
      case 'IS':
        nextAssigneePSN = employeeDetails.nsPSN;
        nextStatus = 'Escalated to NS';
        if (!nextAssigneePSN) { 
             nextAssigneePSN = employeeDetails.dhPSN;
             nextStatus = 'Escalated to DH';
        }
        if (!nextAssigneePSN) {
             const icHead = mockSupervisors.find(s => s.functionalRole === 'IC Head');
             nextAssigneePSN = icHead?.psn;
             nextStatus = 'Escalated to IC Head';
        }
        break;
      case 'NS':
        nextAssigneePSN = employeeDetails.dhPSN;
        nextStatus = 'Escalated to DH';
         if (!nextAssigneePSN) {
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
      toast({title: "Escalation Error", description: "Next supervisor level not found or configured.", variant: "destructive"});
      return;
    }

    const updatedTicket: Ticket = {
        ...ticket,
        status: nextStatus,
        currentAssigneePSN: nextAssigneePSN,
        actionPerformed: `${ticket.actionPerformed || ''}\n---\n${new Date(currentDate).toLocaleString()}: Escalated by ${currentUser.name} (${currentUser.psn}) to ${nextStatus.replace('Escalated to ', '')}.`.trim(),
        lastStatusUpdateDate: currentDate,
        dateOfResponse: currentDate,
    };
    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex > -1) mockTickets[ticketIndex] = updatedTicket;
    setTicket(updatedTicket);
    setNewStatus(nextStatus); 
    setCurrentAssignee(mockSupervisors.find(s => s.psn === nextAssigneePSN)); 
    toast({ title: "Ticket Escalated", description: `Ticket ${ticketId} has been escalated to ${nextStatus.replace('Escalated to ', '')}.` });
  };

  const handleAddEmployeeFollowUp = () => {
    if (!employeeFollowUp.trim() && employeeAttachments.length === 0) {
      toast({ title: "No Information", description: "Please enter your follow-up information or add attachments.", variant: "default" });
      return;
    }
    if (!ticket) return;
    const currentDate = new Date().toISOString();
    const newTicketAttachments = processAttachments(employeeAttachments, ticket.id);

    const updatedTicketData: Ticket = {
      ...ticket,
      followUpQuery: employeeFollowUp.trim() ? `${ticket.followUpQuery || ''}\n---\nEmployee (${new Date(currentDate).toLocaleString()}):\n${employeeFollowUp}`.trim() : ticket.followUpQuery,
      actionPerformed: employeeFollowUp.trim() ? `${ticket.actionPerformed || ''}\n---\nEmployee Follow-up (${new Date(currentDate).toLocaleString()}):\n${employeeFollowUp}`.trim() : ticket.actionPerformed,
      attachments: [...(ticket.attachments || []), ...newTicketAttachments],
    };

    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex > -1) mockTickets[ticketIndex] = updatedTicketData;
    setTicket(updatedTicketData);
    setEmployeeFollowUp("");
    setEmployeeAttachments([]);
    toast({ title: "Information Added", description: "Your follow-up and/or attachments have been added to the ticket." });
  };

  const renderAttachmentsList = (files: File[], setter: React.Dispatch<React.SetStateAction<File[]>>) => (
    files.length > 0 && (
        <div className="mt-2 space-y-1 text-xs">
            <p className="font-medium text-muted-foreground">Selected files to attach:</p>
            <ul className="list-disc list-inside pl-4">
                {files.map(file => (
                    <li key={file.name} className="flex items-center justify-between">
                        <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                        <Button type="button" variant="ghost" size="sm" className="text-destructive h-auto p-1" onClick={() => removeAttachment(file.name, setter)}>Remove</Button>
                    </li>
                ))}
            </ul>
        </div>
    )
  );


  return (
    <ProtectedPage>
      {(user: User) => (
        <div className="space-y-8 max-w-4xl mx-auto py-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {overdueInfo?.isOverdue && !['Resolved', 'Closed'].includes(ticket.status) && (
            <Alert variant="destructive" className="shadow-md">
              <Clock className="h-5 w-5" />
              <AlertTitle>Ticket Overdue!</AlertTitle>
              <AlertDescription>
                This ticket has been open or in its current escalated state for {overdueInfo.daysOpen} day(s). 
                The deadline was {overdueInfo.deadlineDays} day(s). 
                It requires immediate attention. In a live system, this might be automatically escalated to {overdueInfo.nextEscalationLevel}.
              </AlertDescription>
            </Alert>
          )}

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
                   <p><strong>Date of Birth:</strong> {employeeDetails.dateOfBirth ? new Date(employeeDetails.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Project:</strong> {mockProjects.find(p => p.id === employeeDetails.project)?.name || employeeDetails.project}</p>
                  <p><strong>Grade:</strong> <BadgePercent className="inline-block w-4 h-4 mr-1 text-muted-foreground" /> {employeeDetails.grade}</p>
                  <p><strong>Job Code:</strong> {jobCodeDetails?.code} ({jobCodeDetails?.description})</p>
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

              {ticket.attachments && ticket.attachments.length > 0 && (
                <>
                  <hr/>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Attachments</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {ticket.attachments.map(att => (
                        <li key={att.id}>
                          <a href={att.urlOrContent} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {att.fileName} ({att.fileType})
                          </a> - Uploaded: {new Date(att.uploadedAt).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {(ticket.actionPerformed || ticket.dateOfResponse) && (<hr/>)}

              {ticket.actionPerformed && (
                <div>
                    <h3 className="font-semibold text-lg mb-2">Actions Log / Responses</h3>
                    <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md overflow-x-auto">{ticket.actionPerformed}</pre>
                </div>
              )}
              {ticket.dateOfResponse && <p className="text-sm text-muted-foreground"><strong>Last Response Date:</strong> {new Date(ticket.dateOfResponse).toLocaleString()}</p>}
              {ticket.lastStatusUpdateDate && <p className="text-sm text-muted-foreground"><strong>Last Status Update:</strong> {new Date(ticket.lastStatusUpdateDate).toLocaleString()}</p>}


              {currentAssignee && (
                <div>
                    <p className="text-sm text-muted-foreground"><strong>Currently Assigned Supervisor:</strong> {currentAssignee.name} ({currentAssignee.psn}) - {currentAssignee.title}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {(user.role !== 'Employee' && user.psn === ticket.currentAssigneePSN && !['Resolved', 'Closed'].includes(ticket.status)) && (
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
                  <div className="space-y-2">
                    <Label htmlFor="supervisor-attachments">Add Attachments (Optional)</Label>
                    <Button type="button" variant="outline" onClick={() => handleAttachmentClick(supervisorResponseFileRef)} className="w-full justify-start text-left" data-ai-hint="file upload document image video audio link">
                        <Paperclip className="mr-2 h-4 w-4" /> Attach Files
                    </Button>
                    <input type="file" ref={supervisorResponseFileRef} style={{ display: 'none' }} onChange={(e) => handleFileSelected(e, setSupervisorAttachments)} multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" />
                    {renderAttachmentsList(supervisorAttachments, setSupervisorAttachments)}
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
                <CardFooter className="flex justify-between flex-wrap gap-2">
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
                <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Type additional information or a follow-up here..."
                      rows={3}
                      value={employeeFollowUp}
                      onChange={(e) => setEmployeeFollowUp(e.target.value)}
                    />
                    <div className="space-y-2">
                        <Label htmlFor="employee-attachments">Add Attachments (Optional)</Label>
                        <Button type="button" variant="outline" onClick={() => handleAttachmentClick(employeeFollowUpFileRef)} className="w-full justify-start text-left" data-ai-hint="file upload document image video audio link">
                            <Paperclip className="mr-2 h-4 w-4" /> Attach Files
                        </Button>
                        <input type="file" ref={employeeFollowUpFileRef} style={{ display: 'none' }} onChange={(e) => handleFileSelected(e, setEmployeeAttachments)} multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" />
                        {renderAttachmentsList(employeeAttachments, setEmployeeAttachments)}
                    </div>
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
