
export interface User {
  psn: number;
  name: string;
  role: 'Employee' | 'IS' | 'NS' | 'DH' | 'IC Head';
  businessEmail?: string;
  dateOfBirth?: string; // Added for My Profile and Employee details
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
  urlOrContent: string; // For links, this is the URL. For files, might be a data URI or backend link.
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
  attachments?: TicketAttachment[]; // Added for attachments
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
  // attachments would be handled separately via state before adding to ticket object
}

export interface AddEmployeeFormData {
  psn: number;
  name: string;
  businessEmail: string;
  dateOfBirth?: Date; // Changed to Date for react-day-picker
  project: string;
  jobCodeId: string;
  grade: string;
  isPSN?: number;
  nsPSN?: number;
  dhPSN?: number;
}

export interface AddSupervisorFormData {
  psn: number;
  name: string;
  businessEmail: string;
  dateOfBirth?: Date; // Changed to Date
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
