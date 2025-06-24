
export interface User {
  psn: number;
  name: string;
  role: 'Employee' | 'IS' | 'NS' | 'DH' | 'IC Head';
  businessEmail?: string;
  dateOfBirth?: string; 
}

export interface JobCode {
  id: string; 
  code: string; 
  description: string; 
}

export interface Employee extends User {
  role: 'Employee';
  grade: string; 
  jobCodeId: string; 
  project: string;
  gender?: 'Male' | 'Female' | 'Other';
  isPSN?: number;
  isName?: string;
  nsPSN?: number;
  nsName?: string;
  dhPSN?: number;
  dhName?: string;
}

export interface Supervisor extends User {
  role: 'IS' | 'NS' | 'DH' | 'IC Head';
  functionalRole: 'IS' | 'NS' | 'DH' | 'IC Head'; // Added to ensure consistency
  title: string;
  branchProject?: string;
  projectsHandledIds?: string[];
  cityAccess?: string[];
  ticketsResolved?: number;
  ticketsPending?: number;
  isPSN?: number;
  isName?: string;
  nsPSN?: number;
  nsName?: string;
  dhPSN?: number;
  dhName?: string;
}

export type TicketStatus = 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Escalated to NS' | 'Escalated to DH' | 'Escalated to IC Head';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileType: 'document' | 'image' | 'video' | 'audio' | 'link';
  urlOrContent: string; 
  uploadedAt: string;
}

export interface Ticket {
  id: string;
  psn: number;
  employeeName: string;
  query: string;
  followUpQuery?: string;
  priority: TicketPriority;
  dateOfQuery: string;
  actionPerformed?: string;
  dateOfResponse?: string;
  status: TicketStatus;
  currentAssigneePSN?: number;
  project: string;
  attachments?: TicketAttachment[];
  lastStatusUpdateDate: string; 
}

export interface Project {
  id: string;
  name: string;
  city: string;
}

export interface City {
  name: string;
  projects: Project[];
}

export interface NewTicketFormData {
  query: string;
  hasFollowUp: boolean;
  followUpQuery?: string;
  priority: TicketPriority;
}

// Ensure AddEmployeeFormData.psn and supervisor PSNs are strings for consistency with input handling
export interface AddEmployeeFormData {
  psn: string; 
  name: string;
  businessEmail: string;
  dateOfBirth?: Date; 
  project: string;
  jobCodeId: string; 
  grade: string; 
  isPSN?: string; 
  nsPSN?: string; 
  dhPSN?: string; 
}

// Ensure AddSupervisorFormData.psn is a string
export interface AddSupervisorFormData {
  psn: string; 
  name: string;
  businessEmail: string;
  dateOfBirth?: Date; 
  title: string;
  functionalRole: 'IS' | 'NS' | 'DH' | 'IC Head';
  branchProject?: string;
  cityAccess?: string[];
  projectsHandledIds?: string[];
}

export interface PasswordStrengthResult {
  score: number;
  feedback?: {
    warning?: string;
    suggestions?: string[];
  };
  isValid: boolean;
  message: string;
}
