export interface User {
  psn: number; // PS_No changed to number
  name: string;
  role: 'Employee' | 'HR' | 'Head HR'; // Simplified role
  project?: string;
  // Add other common fields if necessary
}

export interface Employee extends User {
  role: 'Employee';
  grade: string;
  gender?: 'Male' | 'Female' | 'Other';
  hrPSN?: number; // HR_PS_No changed to number
  hrName?: string;
}

export interface HR extends User {
  role: 'HR' | 'Head HR';
  projectsHandled: Project[]; // Array of projects this HR handles
  priority?: 1 | 2 | 3; // 1-Head, 2-Second Tier, 3-Third Tier
  ticketsResolved?: number;
  ticketsPending?: number;
}

export type TicketStatus = 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Escalated';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Ticket {
  id: string; // Ticket_ID
  psn: number; // Employee's PS_No changed to number
  employeeName: string; // EMP_NAME
  query: string;
  followUpQuery?: string;
  priority: TicketPriority;
  dateOfQuery: string; // ISO date string
  actionPerformed?: string;
  dateOfResponse?: string; // ISO date string
  status: TicketStatus;
  hrPSNAssigned?: number; // PS_No of HR assigned or who responded, changed to number
  escalatedToPSN?: number; // PS_No of Head HR if escalated, changed to number
  project: string; // Project associated with the ticket (derived from employee)
}

export interface Project {
  id: string;
  name: string;
  city: string; // City name like 'Chennai', 'Delhi'
  assignedHRs: number[]; // Array of HR PS_Nos, changed to number[]
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
  psn: number; // Changed to number
  name: string;
  project: string;
  role: string; // e.g., "Engineer", "Manager" - specific role, not "Employee"
  grade: string;
}

export interface AddHrFormData {
  psn: number; // Changed to number
  name: string;
  projectsHandled: string[]; // Project IDs
  priority: 1 | 2 | 3;
  role: 'HR' | 'Head HR';
}

// For password strength
export interface PasswordStrengthResult {
  score: number; // 0-4 typically
  feedback?: {
    warning?: string;
    suggestions?: string[];
  };
  isValid: boolean;
  message: string;
}
