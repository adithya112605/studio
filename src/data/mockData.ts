import type { Employee, HR, Ticket, Project, City } from '@/types';

export const mockProjects: Project[] = [
  // Chennai
  { id: 'CH001', name: 'Chennai Metro Phase 1A', city: 'Chennai', assignedHRs: ['HR001'] },
  { id: 'CH002', name: 'Chennai Metro Phase 1B', city: 'Chennai', assignedHRs: ['HR001'] },
  { id: 'CH003', name: 'Chennai Metro Expansion A', city: 'Chennai', assignedHRs: ['HR001'] },
  { id: 'CH004', name: 'Chennai Metro Corridor X', city: 'Chennai', assignedHRs: ['HR002'] },
  { id: 'CH005', name: 'Chennai Metro Corridor Y', city: 'Chennai', assignedHRs: ['HR002'] },
  // Delhi
  { id: 'DL001', name: 'Delhi Metro Line 8', city: 'Delhi', assignedHRs: ['HR003'] },
  { id: 'DL002', name: 'Delhi Metro Airport Link', city: 'Delhi', assignedHRs: ['HR003'] },
  // Kolkata
  { id: 'KL001', name: 'Kolkata East-West Metro', city: 'Kolkata', assignedHRs: ['HR004'] },
  // Mumbai
  { id: 'MB001', name: 'Mumbai Metro Line 3', city: 'Mumbai', assignedHRs: ['HR005'] },
  { id: 'MB002', name: 'Mumbai Metro Line 2A', city: 'Mumbai', assignedHRs: ['HR005'] },
  { id: 'MB003', name: 'Mumbai Metro Line 7', city: 'Mumbai', assignedHRs: ['HR006'] },
  { id: 'MB004', name: 'Navi Mumbai Metro Line 1', city: 'Mumbai', assignedHRs: ['HR006'] },
  { id: 'MB005', name: 'Mumbai Monorail Ext', city: 'Mumbai', assignedHRs: ['HR005'] },
  // Patna
  { id: 'PT001', name: 'Patna Metro Corridor 1', city: 'Patna', assignedHRs: ['HR007'] },
  { id: 'PT002', name: 'Patna Metro Corridor 2', city: 'Patna', assignedHRs: ['HR007'] },
];

export const mockCities: City[] = [
  { name: 'Chennai', projects: mockProjects.filter(p => p.city === 'Chennai') },
  { name: 'Delhi', projects: mockProjects.filter(p => p.city === 'Delhi') },
  { name: 'Kolkata', projects: mockProjects.filter(p => p.city === 'Kolkata') },
  { name: 'Mumbai', projects: mockProjects.filter(p => p.city === 'Mumbai') },
  { name: 'Patna', projects: mockProjects.filter(p => p.city === 'Patna') },
];

export const mockHRs: HR[] = [
  { psn: 'HR000000', name: 'Dr. Evelyn Reed (Head)', role: 'Head HR', projectsHandled: mockProjects, priority: 1, ticketsResolved: 15, ticketsPending: 2  },
  { psn: 'HR000001', name: 'Ramesh Kumar', role: 'HR', projectsHandled: mockProjects.filter(p=>p.id.startsWith('CH001') || p.id.startsWith('CH002') || p.id.startsWith('CH003')), priority: 2, ticketsResolved: 10, ticketsPending: 3 },
  { psn: 'HR000002', name: 'Sunita Sharma', role: 'HR', projectsHandled: mockProjects.filter(p=>p.id.startsWith('CH004') || p.id.startsWith('CH005')), priority: 2, ticketsResolved: 8, ticketsPending: 1 },
  { psn: 'HR000003', name: 'Amit Singh', role: 'HR', projectsHandled: mockProjects.filter(p=>p.city === 'Delhi'), priority: 2, ticketsResolved: 12, ticketsPending: 2 },
  { psn: 'HR000004', name: 'Priya Das', role: 'HR', projectsHandled: mockProjects.filter(p=>p.city === 'Kolkata'), priority: 2, ticketsResolved: 7, ticketsPending: 0 },
  { psn: 'HR000005', name: 'Vijay Patil', role: 'HR', projectsHandled: mockProjects.filter(p=>(p.id.startsWith('MB001') || p.id.startsWith('MB002') || p.id.startsWith('MB005'))), priority: 2, ticketsResolved: 11, ticketsPending: 4 },
  { psn: 'HR000006', name: 'Anita Desai', role: 'HR', projectsHandled: mockProjects.filter(p=>(p.id.startsWith('MB003') || p.id.startsWith('MB004'))), priority: 2, ticketsResolved: 9, ticketsPending: 1 },
  { psn: 'HR000007', name: 'Rajesh Gupta', role: 'HR', projectsHandled: mockProjects.filter(p=>p.city === 'Patna'), priority: 2, ticketsResolved: 6, ticketsPending: 1 },
];

// Function to get HR details for an employee based on project
const getHRForProject = (projectId: string): { hrPSN?: string; hrName?: string } => {
  const project = mockProjects.find(p => p.id === projectId);
  if (project && project.assignedHRs.length > 0) {
    // Pick the first assigned HR for simplicity
    const hr = mockHRs.find(h => h.psn === project.assignedHRs[0]);
    return { hrPSN: hr?.psn, hrName: hr?.name };
  }
  return {};
};


export const mockEmployees: Employee[] = [
  { psn: 'EMP00001', name: 'Aarav Patel', role: 'Employee', project: 'CH001', grade: 'E1', gender: 'Male', ...getHRForProject('CH001') },
  { psn: 'EMP00002', name: 'Diya Mehta', role: 'Employee', project: 'CH004', grade: 'E2', gender: 'Female', ...getHRForProject('CH004') },
  { psn: 'EMP00003', name: 'Rohan Joshi', role: 'Employee', project: 'DL001', grade: 'E1', gender: 'Male', ...getHRForProject('DL001') },
  { psn: 'EMP00004', name: 'Sneha Reddy', role: 'Employee', project: 'KL001', grade: 'E3', gender: 'Female', ...getHRForProject('KL001') },
  { psn: 'EMP00005', name: 'Vikram Singh', role: 'Employee', project: 'MB001', grade: 'E2', gender: 'Male', ...getHRForProject('MB001') },
  { psn: 'EMP00006', name: 'Priya Iyer', role: 'Employee', project: 'PT001', grade: 'E1', gender: 'Female', ...getHRForProject('PT001') },
];


export const mockTickets: Ticket[] = [
  {
    id: 'TKT001',
    psn: 'EMP00001',
    employeeName: 'Aarav Patel',
    query: 'Unable to access project documents on the shared drive. Receiving an access denied error.',
    priority: 'High',
    dateOfQuery: '2024-05-01T10:00:00Z',
    status: 'Open',
    hrPSNAssigned: getHRForProject('CH001').hrPSN,
    project: 'CH001',
  },
  {
    id: 'TKT002',
    psn: 'EMP00002',
    employeeName: 'Diya Mehta',
    query: 'My salary for last month has not been credited yet. Please check.',
    followUpQuery: 'This is a critical issue as I have outstanding payments.',
    priority: 'Urgent',
    dateOfQuery: '2024-05-02T14:30:00Z',
    status: 'In Progress',
    actionPerformed: 'Forwarded to payroll department. Awaiting update.',
    dateOfResponse: '2024-05-03T09:00:00Z',
    hrPSNAssigned: getHRForProject('CH004').hrPSN,
    project: 'CH004',
  },
  {
    id: 'TKT003',
    psn: 'EMP00003',
    employeeName: 'Rohan Joshi',
    query: 'Request for leave approval from May 10th to May 15th.',
    priority: 'Medium',
    dateOfQuery: '2024-04-28T11:00:00Z',
    status: 'Resolved',
    actionPerformed: 'Leave approved by manager.',
    dateOfResponse: '2024-04-29T16:00:00Z',
    hrPSNAssigned: getHRForProject('DL001').hrPSN,
    project: 'DL001',
  },
   {
    id: 'TKT004',
    psn: 'EMP00005',
    employeeName: 'Vikram Singh',
    query: 'Software license for CAD tool has expired. Need renewal.',
    priority: 'High',
    dateOfQuery: '2024-05-03T12:00:00Z',
    status: 'Open',
    hrPSNAssigned: getHRForProject('MB001').hrPSN,
    project: 'MB001',
  },
  {
    id: 'TKT005',
    psn: 'EMP00001',
    employeeName: 'Aarav Patel',
    query: 'Issue with VPN connection. Dropping frequently.',
    priority: 'Medium',
    dateOfQuery: '2024-05-04T09:15:00Z',
    status: 'Pending',
    hrPSNAssigned: getHRForProject('CH001').hrPSN,
    project: 'CH001',
    escalatedToPSN: 'HR000000', // Escalated to Head HR
  },
];
