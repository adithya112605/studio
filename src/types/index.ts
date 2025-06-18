
export interface User {
  psn: number;
  name: string;
  role: 'Employee' | 'IS' | 'NS' | 'DH' | 'IC Head'; // Updated roles
  businessEmail?: string; // Added
  // project field was general, specific project association is now mainly in Employee
}

export interface JobCode {
  id: string; // e.g., JC001
  code: string; // e.g., M1-A, GET
  description: string; // e.g., Manager Grade 1A, Graduate Engineer Trainee
}

export interface Employee extends User {
  role: 'Employee';
  grade: string; // Kept for original structure, JobCode provides more detail
  jobCodeId: string; // Link to JobCode table
  project: string; // Project ID employee is assigned to
  gender?: 'Male' | 'Female' | 'Other';
  isPSN?: number;
  isName?: string;
  nsPSN?: number;
  nsName?: string;
  dhPSN?: number;
  dhName?: string;
  // Removed hrPSN, hrName
}

export interface Supervisor extends User {
  role: 'IS' | 'NS' | 'DH' | 'IC Head';
  title: string; // e.g., Site Incharge, Project Manager, Cluster Head
  branchProject?: string; // Primary project/department affiliation
  projectsHandledIds?: string[]; // Project IDs they oversee (relevant for DH, IC Head primarily)
  cityAccess?: string[]; // Cities a DH or IC Head has access to
  ticketsResolved?: number; // Dynamic
  ticketsPending?: number; // Dynamic
}

export type TicketStatus = 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Escalated to NS' | 'Escalated to DH' | 'Escalated to IC Head';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Ticket {
  id: string;
  psn: number; // Employee's PS_No
  employeeName: string;
  query: string;
  followUpQuery?: string;
  priority: TicketPriority;
  dateOfQuery: string; // ISO date string
  actionPerformed?: string;
  dateOfResponse?: string; // ISO date string
  status: TicketStatus;
  currentAssigneePSN?: number; // PS_No of current supervisor (IS, NS, DH, IC Head) handling the ticket
  project: string; // Project ID associated with the ticket
}

export interface Project {
  id: string; // e.g., P001, P002
  name: string; // e.g., Chennai Metro Phase 1A
  city: string; // e.g., Chennai, Delhi
  // removed assignedHRs, as supervisor logic is now different
}

export interface City {
  name: string;
  projects: Project[];
}

// For form inputs
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
  project: string; // Project ID
  jobCodeId: string; // JobCode ID
  grade: string; // Kept for consistency, but jobCodeId is primary
  isPSN?: number;
  nsPSN?: number;
  dhPSN?: number;
}

export interface AddSupervisorFormData {
  psn: number;
  name: string;
  businessEmail: string;
  title: string;
  functionalRole: 'IS' | 'NS' | 'DH' | 'IC Head';
  branchProject?: string;
  cityAccess?: string[]; // For DH/IC Head
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
