
export interface User {
  psn: number;
  name: string;
  role: 'Employee' | 'IS' | 'NS' | 'DH' | 'IC Head';
  businessEmail?: string;
  dateOfBirth?: string; 
}

export interface JobCode {
  id: string; // e.g., "1100178", "P026"
  code: string; // e.g., "1100178", "P026" (can be same as id)
  description: string; // e.g., "Planning manager", "Project Management Group"
}

export interface Employee extends User {
  role: 'Employee';
  grade: string; // e.g., "M1-A", "M2-B" (from mockGrades)
  jobCodeId: string; // References id in JobCode type
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
  title: string;
  branchProject?: string;
  projectsHandledIds?: string[];
  cityAccess?: string[];
  ticketsResolved?: number;
  ticketsPending?: number;
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

export interface AddEmployeeFormData {
  psn: number;
  name: string;
  businessEmail: string;
  dateOfBirth?: Date; 
  project: string;
  jobCodeId: string; // Will be the ID from the new JobCode list
  grade: string; // Will be a value from the predefined mockGrades list
  isPSN?: number;
  nsPSN?: number;
  dhPSN?: number;
}

export interface AddSupervisorFormData {
  psn: number;
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
