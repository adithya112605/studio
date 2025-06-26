
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Ticket, Employee, Supervisor, TicketStatus, JobCode, Project, TicketAttachment } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TicketResolutionSuggestions from "@/components/hr/TicketResolutionSuggestions";
import Link from "next/link";
import { AlertTriangle, ShieldAlert, Paperclip, ArrowLeft, Edit3, Send, Clock, BadgePercent, Activity, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ScrollReveal from "@/components/common/ScrollReveal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { 
    getTicketByIdAction, 
    getEmployeeByPsn, 
    getJobCodeByIdAction, 
    getProjectByIdAction, 
    getSupervisorByPsnAction,
    updateTicketAction,
    getAllSupervisorsAction,
} from "@/lib/actions";


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

interface OverdueInfoType {
    isOverdue: boolean;
    daysOpenOrSinceEscalation: string;
    deadlineDays: number;
    nextEscalationLevel: string | null;
    ticketStatus: TicketStatus;
}


const TicketDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const router = useRouter();
  const supervisorResponseFileRef = useRef<HTMLInputElement>(null);
  const employeeFollowUpFileRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<Employee | null>(null);
  const [jobCodeDetails, setJobCodeDetails] = useState<JobCode | null>(null);
  const [projectDetails, setProjectDetails] = useState<Project | null>(null);
  const [currentAssignee, setCurrentAssignee] = useState<Supervisor | null>(null);
  const [displayOverdueInfo, setDisplayOverdueInfo] = useState<OverdueInfoType | null>(null);

  const [supervisorResponse, setSupervisorResponse] = useState("");
  const [newStatus, setNewStatus] = useState<TicketStatus | undefined>(undefined);
  const [employeeFollowUp, setEmployeeFollowUp] = useState("");
  const [supervisorAttachments, setSupervisorAttachments] = useState<File[]>([]);
  const [employeeAttachments, setEmployeeAttachments] = useState<File[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const currentTicket = await getTicketByIdAction(id);
            if (!currentTicket) {
                toast({ title: "Error", description: "Ticket not found.", variant: "destructive" });
                setTicket(null);
                return;
            }
            setTicket(currentTicket);
            setNewStatus(currentTicket.status);

            const [emp, assignee] = await Promise.all([
                getEmployeeByPsn(currentTicket.psn),
                currentTicket.currentAssigneePSN ? getSupervisorByPsnAction(currentTicket.currentAssigneePSN) : Promise.resolve(null),
            ]);
            setEmployeeDetails(emp);
            setCurrentAssignee(assignee);

            if (emp) {
                const [jobCode, project] = await Promise.all([
                    emp.jobCodeId ? getJobCodeByIdAction(emp.jobCodeId) : Promise.resolve(null),
                    emp.project ? getProjectByIdAction(emp.project) : Promise.resolve(null),
                ]);
                setJobCodeDetails(jobCode);
                setProjectDetails(project);
            }
        } catch (error) {
            console.error("Failed to fetch ticket details:", error);
            toast({ title: "Error", description: "Could not load ticket details.", variant: "destructive"});
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, [id, toast]);

  useEffect(() => {
    if (ticket && employeeDetails && ticket.lastStatusUpdateDate) {
        const now = new Date();
        const lastUpdate = new Date(ticket.lastStatusUpdateDate);
        const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let deadlineDays = Infinity;
        let nextEscalationLevel: string | null = null;

        // Note: This logic for finding the next level could be more robust in a real system
        // but works for this mock setup. In a production system, this would be a backend process.
        const findSupervisor = async () => {
            if (ticket.status === 'Open' && ticket.currentAssigneePSN === employeeDetails.isPSN) {
                deadlineDays = 2;
                const ns = employeeDetails.nsPSN ? await getSupervisorByPsnAction(employeeDetails.nsPSN) : null;
                const dh = employeeDetails.dhPSN ? await getSupervisorByPsnAction(employeeDetails.dhPSN) : null;
                nextEscalationLevel = ns ? `NS (${ns.name})` : (dh ? `DH (${dh.name})` : "Higher Authority");
            } else if (ticket.status === 'Escalated to NS' && ticket.currentAssigneePSN === employeeDetails.nsPSN) {
                deadlineDays = 1;
                const dh = employeeDetails.dhPSN ? await getSupervisorByPsnAction(employeeDetails.dhPSN) : null;
                nextEscalationLevel = dh ? `DH (${dh.name})` : "Higher Authority";
            } else if (ticket.status === 'Escalated to DH' && ticket.currentAssigneePSN === employeeDetails.dhPSN) {
                deadlineDays = 1;
                const allSupervisors = await getAllSupervisorsAction();
                const icHead = allSupervisors.find(s => s.functionalRole === 'IC Head');
                nextEscalationLevel = icHead ? `IC Head (${icHead.name})` : "Higher Authority";
            }
            
            const isOverdue = diffDays > deadlineDays && deadlineDays !== Infinity;
            setDisplayOverdueInfo({
                isOverdue,
                daysOpenOrSinceEscalation: diffDays.toFixed(0),
                deadlineDays,
                nextEscalationLevel,
                ticketStatus: ticket.status
            });
        };
        findSupervisor();
    } else {
        setDisplayOverdueInfo(null);
    }
  }, [ticket, employeeDetails]);

  if (isLoading) {
      return (
          <ProtectedPage>
              <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4">
                  <LoadingSpinner />
                  <p className="mt-4 text-muted-foreground">Loading ticket details...</p>
              </div>
          </ProtectedPage>
      );
  }

  if (!ticket) {
    return (
      <ProtectedPage>
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-4">
          <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
            <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
            <h1 className="text-3xl font-bold mb-2">Ticket Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The ticket ID <span className="font-mono bg-muted px-1 py-0.5 rounded">{id}</span> could not be found.
            </p>
            <p className="text-muted-foreground mt-1">It might have been deleted or the ID is incorrect.</p>
            <Button asChild className="mt-8">
              <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
            </Button>
          </ScrollReveal>
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
      // Simplified attachment logic for demo; in production, you might have more robust checks
      attachmentSetter(prev => [...prev, ...newFiles]);
      newFiles.forEach(file => {
          toast({
              title: "File Added",
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

  const handleSupervisorUpdate = async () => {
    if (!newStatus && !supervisorResponse && supervisorAttachments.length === 0) {
        toast({title: "No Changes", description: "Please provide a response, select a new status, or add attachments.", variant: "default"});
        return;
    }
    if (!ticket) return;
    
    setIsLoading(true);
    const currentDate = new Date().toISOString();
    try {
        const updateData: Partial<Ticket> = {
            status: newStatus || ticket.status,
            actionPerformed: supervisorResponse
                ? `${ticket.actionPerformed || ''}\n---\nSupervisor (${new Date(currentDate).toLocaleString()}):\n${supervisorResponse}`.trim()
                : ticket.actionPerformed,
            dateOfResponse: supervisorResponse || (newStatus && newStatus !== ticket.status) || supervisorAttachments.length > 0 ? currentDate : ticket.dateOfResponse,
            lastStatusUpdateDate: (newStatus && newStatus !== ticket.status) || supervisorResponse || supervisorAttachments.length > 0 ? currentDate : ticket.lastStatusUpdateDate,
        };
        await updateTicketAction(ticket.id, updateData, supervisorAttachments);
        setTicket(prev => prev ? {...prev, ...updateData} : null); // Optimistic update
        setSupervisorResponse("");
        setSupervisorAttachments([]);
        toast({title: "Ticket Updated", description: `Status changed to ${updateData.status}. Response and/or attachments added.`});
        router.refresh();
    } catch (error) {
        toast({title: "Error", description: "Failed to update ticket.", variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
  };

  const handleEscalate = async (currentUser: Supervisor) => {
    if (!ticket || !employeeDetails) return;
    setIsLoading(true);
    
    let nextAssigneePSN: number | undefined;
    let nextStatusEscalate: TicketStatus | undefined;
    let nextLevelRoleName = "";

    const allSupervisors = await getAllSupervisorsAction();
    const icHead = allSupervisors.find(s => s.functionalRole === 'IC Head');

    let currentLevelRole = ticket.status.startsWith('Escalated to ') ? ticket.status.split(' ')[2] as 'NS'|'DH'|'IC Head' : (ticket.status === 'Open' ? 'IS' : currentUser.functionalRole);

    switch (currentLevelRole) {
      case 'IS':
        nextAssigneePSN = employeeDetails.nsPSN || employeeDetails.dhPSN || icHead?.psn;
        nextStatusEscalate = employeeDetails.nsPSN ? 'Escalated to NS' : (employeeDetails.dhPSN ? 'Escalated to DH' : 'Escalated to IC Head');
        nextLevelRoleName = employeeDetails.nsPSN ? 'NS' : (employeeDetails.dhPSN ? 'DH' : 'IC Head');
        break;
      case 'NS':
        nextAssigneePSN = employeeDetails.dhPSN || icHead?.psn;
        nextStatusEscalate = employeeDetails.dhPSN ? 'Escalated to DH' : 'Escalated to IC Head';
        nextLevelRoleName = employeeDetails.dhPSN ? 'DH' : 'IC Head';
        break;
      case 'DH':
        nextAssigneePSN = icHead?.psn;
        nextStatusEscalate = 'Escalated to IC Head';
        nextLevelRoleName = 'IC Head';
        break;
      default:
        toast({title: "Escalation Error", description: "Cannot escalate further.", variant: "destructive"});
        setIsLoading(false);
        return;
    }

    if (!nextAssigneePSN || !nextStatusEscalate) {
      toast({title: "Escalation Error", description: "Next supervisor level not found.", variant: "destructive"});
      setIsLoading(false);
      return;
    }
    
    const nextAssigneeDetails = allSupervisors.find(s => s.psn === nextAssigneePSN);
    const currentDate = new Date().toISOString();
    try {
        const updateData: Partial<Ticket> = {
            status: nextStatusEscalate,
            currentAssigneePSN: nextAssigneePSN,
            actionPerformed: `${ticket.actionPerformed || ''}\n---\n${new Date(currentDate).toLocaleString()}: Escalated by ${currentUser.name} (${currentUser.psn}) to ${nextLevelRoleName} (${nextAssigneeDetails?.name || 'N/A'}).`.trim(),
            lastStatusUpdateDate: currentDate, 
            dateOfResponse: currentDate, 
        };
        await updateTicketAction(ticket.id, updateData);
        setTicket(prev => prev ? {...prev, ...updateData} : null); // Optimistic update
        setNewStatus(nextStatusEscalate); 
        setCurrentAssignee(nextAssigneeDetails || null); 
        toast({ title: "Ticket Escalated", description: `Ticket ${id} has been escalated to ${nextLevelRoleName} (${nextAssigneeDetails?.name || 'N/A'}).` });
        router.refresh();
    } catch(e) {
        toast({ title: "Error", description: "Failed to escalate ticket.", variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
  };

  const handleAddEmployeeFollowUp = async () => {
    if (!employeeFollowUp.trim() && employeeAttachments.length === 0) {
      toast({ title: "No Information", description: "Please enter your follow-up information or add attachments.", variant: "default" });
      return;
    }
    if (!ticket) return;

    setIsLoading(true);
    try {
        const currentDate = new Date().toISOString();
        const updateData: Partial<Ticket> = {
            followUpQuery: employeeFollowUp.trim() ? `${ticket.followUpQuery || ''}\n---\nEmployee (${new Date(currentDate).toLocaleString()}):\n${employeeFollowUp}`.trim() : ticket.followUpQuery,
            actionPerformed: employeeFollowUp.trim() ? `${ticket.actionPerformed || ''}\n---\nEmployee Follow-up (${new Date(currentDate).toLocaleString()}):\n${employeeFollowUp}`.trim() : ticket.actionPerformed,
        };
        await updateTicketAction(ticket.id, updateData, employeeAttachments);
        setTicket(prev => prev ? {...prev, ...updateData} : null); // Optimistic update
        setEmployeeFollowUp("");
        setEmployeeAttachments([]);
        toast({ title: "Information Added", description: "Your follow-up and/or attachments have been added to the ticket." });
        router.refresh();
    } catch (e) {
        toast({ title: "Error", description: "Failed to add information.", variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
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
  
  const canEscalate = (currentUser: Supervisor, currentTicket: Ticket): boolean => {
    if (!currentTicket || !employeeDetails) return false;
    const status = currentTicket.status;
    
    if (currentUser.functionalRole === 'IC Head' || status === 'Escalated to IC Head') return false; 
    if (['Resolved', 'Closed'].includes(status)) return false; 

    if (currentTicket.currentAssigneePSN !== currentUser.psn) return false; 

    if (currentUser.functionalRole === 'IS') return !!(employeeDetails.nsPSN || employeeDetails.dhPSN);
    if (currentUser.functionalRole === 'NS') return !!(employeeDetails.dhPSN);
    if (currentUser.functionalRole === 'DH') return true; // Can always escalate to IC Head
    
    return false; 
  };


  return (
    <ProtectedPage>
      {(user: User) => {
        const isTicketOwner = user.psn === ticket.psn;
        
        return (
        <div className="container mx-auto max-w-4xl py-6 px-4 md:px-6 lg:px-8 space-y-8">
          <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
            <Button variant="outline" onClick={() => router.back()} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </ScrollReveal>

          {displayOverdueInfo?.isOverdue && !['Resolved', 'Closed'].includes(ticket.status) && (
            <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={100}>
            <Alert variant="destructive" className="shadow-md">
              <Clock className="h-5 w-5" />
              <AlertTitle>Ticket Overdue!</AlertTitle>
              <AlertDescription>
                This ticket has been in status <span className="font-semibold">"{displayOverdueInfo.ticketStatus}"</span> for {displayOverdueInfo.daysOpenOrSinceEscalation} day(s). 
                The deadline for this stage was {displayOverdueInfo.deadlineDays} day(s). 
                {displayOverdueInfo.nextEscalationLevel && ` Escalation to ${displayOverdueInfo.nextEscalationLevel} may be required.`}
              </AlertDescription>
            </Alert>
            </ScrollReveal>
          )}
          
          <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={displayOverdueInfo?.isOverdue ? 200 : 100}>
            <Card className="shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
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
                {employeeDetails && (
                    <div>
                    <h3 className="font-semibold text-lg mb-2">Employee Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p><strong>PSN:</strong> {employeeDetails.psn}</p>
                        <p><strong>Name:</strong> {employeeDetails.name}</p>
                        <p><strong>Business Email:</strong> {employeeDetails.businessEmail || 'N/A'}</p>
                        <p><strong>Date of Birth:</strong> {employeeDetails.dateOfBirth ? new Date(employeeDetails.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Project:</strong> {projectDetails?.name || employeeDetails.project}</p>
                        <p><strong>Grade (Pay Level):</strong> <BadgePercent className="inline-block w-4 h-4 mr-1 text-muted-foreground" /> {employeeDetails.grade}</p>
                        <p><strong>Job Code (Title):</strong> <Activity className="inline-block w-4 h-4 mr-1 text-muted-foreground" /> {jobCodeDetails?.code} - {jobCodeDetails?.description || 'N/A'}</p>
                        <p><strong>IS:</strong> {employeeDetails.isName} ({employeeDetails.isPSN})</p>
                        <p><strong>NS:</strong> {employeeDetails.nsName} ({employeeDetails.nsPSN})</p>
                        <p><strong>DH:</strong> {employeeDetails.dhName} ({employeeDetails.dhPSN})</p>
                    </div>
                    </div>
                )}
                <hr/>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Query Details</h3>
                  <div className="text-sm"><strong>Priority:</strong> <Badge variant={ticket.priority === "Urgent" || ticket.priority === "High" ? "destructive" : "secondary"}>{ticket.priority}</Badge></div>
                  <p className="mt-2 whitespace-pre-wrap text-sm"><strong>Initial Query:</strong> {ticket.query}</p>
                  {ticket.followUpQuery && <p className="mt-2 whitespace-pre-wrap text-sm"><strong>Follow-ups:</strong> {ticket.followUpQuery}</p>}
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
          </ScrollReveal>

          {user.role !== 'Employee' && isTicketOwner && user.psn !== ticket.currentAssigneePSN && (
            <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={300}>
              <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="text-blue-800 dark:text-blue-300">Information</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-400">
                  This is your own ticket. You cannot perform management actions because it is currently assigned to another supervisor.
                </AlertDescription>
              </Alert>
            </ScrollReveal>
          )}

          {(user.role !== 'Employee' && user.psn === ticket.currentAssigneePSN && !['Resolved', 'Closed'].includes(ticket.status)) && (
            <>
              <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={300}>
                <TicketResolutionSuggestions ticketQuery={ticket.query} />
              </ScrollReveal>
              <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={400}>
                <Card className="shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
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
                      <Button type="button" variant="outline" onClick={() => handleAttachmentClick(supervisorResponseFileRef)} className="w-full justify-start text-left">
                          <Paperclip className="mr-2 h-4 w-4" /> Attach Files (Max 5)
                      </Button>
                      <input type="file" ref={supervisorResponseFileRef} style={{ display: 'none' }} onChange={(e) => handleFileSelected(e, setSupervisorAttachments)} multiple />
                      {renderAttachmentsList(supervisorAttachments, setSupervisorAttachments)}
                    </div>
                    <div>
                      <Label htmlFor="newStatus">Update Status</Label>
                      <Select value={newStatus || ticket.status} onValueChange={(value) => setNewStatus(value as TicketStatus)}>
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
                  <CardFooter className="flex justify-between items-center flex-wrap gap-2">
                    <Button onClick={handleSupervisorUpdate} disabled={isLoading}>
                      <Send className="mr-2 h-4 w-4" /> Update Ticket
                    </Button>
                    { canEscalate(user as Supervisor, ticket) && (
                      <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive-foreground" onClick={() => handleEscalate(user as Supervisor)} disabled={isLoading}>
                          <ShieldAlert className="mr-2 h-4 w-4"/> Escalate
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </ScrollReveal>
            </>
          )}

          {user.role === 'Employee' && !['Resolved', 'Closed'].includes(ticket.status) && (
            <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={300}>
             <Card className="shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
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
                        <Button type="button" variant="outline" onClick={() => handleAttachmentClick(employeeFollowUpFileRef)} className="w-full justify-start text-left">
                            <Paperclip className="mr-2 h-4 w-4" /> Attach Files (Max 5)
                        </Button>
                        <input type="file" ref={employeeFollowUpFileRef} style={{ display: 'none' }} onChange={(e) => handleFileSelected(e, setEmployeeAttachments)} multiple />
                        {renderAttachmentsList(employeeAttachments, setEmployeeAttachments)}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleAddEmployeeFollowUp} disabled={isLoading}><Edit3 className="mr-2 h-4 w-4" /> Add Information</Button>
                </CardFooter>
             </Card>
            </ScrollReveal>
          )}
        </div>
        );
      }}
    </ProtectedPage>
  );
};

export default TicketDetailPage;
