
import type { Employee, HR, Ticket, Project, City } from '@/types';

// Function to generate new Ticket IDs
const generateTicketId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `#TK${result}`;
};

// PSN Scheme: Employees: 1xxxxxxx, Regular HR: 2xxxxxxx, Head HR: 3xxxxxxx
const employeePSNs = {
  aarav: 10000001,
  diya: 10000002,
  rohan: 10000003,
  sneha: 10000004,
  vikram: 10000005,
  priyaI: 10000006,
  arjun: 10000007,
  meera: 10000008,
};

const hrPSNs = {
  headHR: 30000000, // Dr. Evelyn Reed
  ramesh: 20000001,
  sunita: 20000002,
  amit: 20000003,
  priyaD: 20000004,
  vijay: 20000005,
  anita: 20000006,
  rajesh: 20000007,
};


export const mockProjects: Project[] = [
  // Chennai (5)
  { id: 'CH001', name: 'Chennai Metro Phase 1A', city: 'Chennai', assignedHRs: [hrPSNs.ramesh] },
  { id: 'CH002', name: 'Chennai Metro Phase 1B', city: 'Chennai', assignedHRs: [hrPSNs.ramesh] },
  { id: 'CH003', name: 'Chennai IT Park Expansion', city: 'Chennai', assignedHRs: [hrPSNs.ramesh] },
  { id: 'CH004', name: 'Chennai Port Corridor X', city: 'Chennai', assignedHRs: [hrPSNs.sunita] },
  { id: 'CH005', name: 'Chennai Smart City Y', city: 'Chennai', assignedHRs: [hrPSNs.sunita] },
  // Delhi (5)
  { id: 'DL001', name: 'Delhi Metro Line 8 Ext', city: 'Delhi', assignedHRs: [hrPSNs.amit] },
  { id: 'DL002', name: 'Delhi Airport T4 Dev', city: 'Delhi', assignedHRs: [hrPSNs.amit] },
  { id: 'DL003', name: 'Delhi Ring Road Upgrade', city: 'Delhi', assignedHRs: [hrPSNs.amit] },
  { id: 'DL004', name: 'Delhi East Housing', city: 'Delhi', assignedHRs: [hrPSNs.amit] },
  { id: 'DL005', name: 'Delhi Solar Park', city: 'Delhi', assignedHRs: [hrPSNs.amit] },
  // Kolkata (4)
  { id: 'KL001', name: 'Kolkata East-West Metro', city: 'Kolkata', assignedHRs: [hrPSNs.priyaD] },
  { id: 'KL002', name: 'Kolkata Bridge Repair', city: 'Kolkata', assignedHRs: [hrPSNs.priyaD] },
  { id: 'KL003', name: 'Kolkata Port Modernization', city: 'Kolkata', assignedHRs: [hrPSNs.priyaD] },
  { id: 'KL004', name: 'Kolkata Water Treatment', city: 'Kolkata', assignedHRs: [hrPSNs.priyaD] },
  // Mumbai (7)
  { id: 'MB001', name: 'Mumbai Metro Line 3', city: 'Mumbai', assignedHRs: [hrPSNs.vijay] },
  { id: 'MB002', name: 'Mumbai Metro Line 2A', city: 'Mumbai', assignedHRs: [hrPSNs.vijay] },
  { id: 'MB003', name: 'Mumbai Metro Line 7', city: 'Mumbai', assignedHRs: [hrPSNs.anita] },
  { id: 'MB004', name: 'Navi Mumbai Airport', city: 'Mumbai', assignedHRs: [hrPSNs.anita] },
  { id: 'MB005', name: 'Mumbai Coastal Road', city: 'Mumbai', assignedHRs: [hrPSNs.vijay] },
  { id: 'MB006', name: 'Thane Infra Upgrade', city: 'Mumbai', assignedHRs: [hrPSNs.anita] },
  { id: 'MB007', name: 'Pune Expressway Widening', city: 'Mumbai', assignedHRs: [hrPSNs.vijay] },
  // Patna (3)
  { id: 'PT001', name: 'Patna Metro Corridor 1', city: 'Patna', assignedHRs: [hrPSNs.rajesh] },
  { id: 'PT002', name: 'Patna Metro Corridor 2', city: 'Patna', assignedHRs: [hrPSNs.rajesh] },
  { id: 'PT003', name: 'Patna Riverfront Dev', city: 'Patna', assignedHRs: [hrPSNs.rajesh] },
  // Bangalore (3)
  { id: 'BLR001', name: 'Bangalore Tech Park IV', city: 'Bangalore', assignedHRs: [hrPSNs.headHR] },
  { id: 'BLR002', name: 'Bangalore Airport Expansion', city: 'Bangalore', assignedHRs: [hrPSNs.headHR] },
  { id: 'BLR003', name: 'Bangalore Ring Road Phase 2', city: 'Bangalore', assignedHRs: [hrPSNs.headHR] },
];

export const mockCities: City[] = [
  { name: 'Chennai', projects: mockProjects.filter(p => p.city === 'Chennai') },
  { name: 'Delhi', projects: mockProjects.filter(p => p.city === 'Delhi') },
  { name: 'Kolkata', projects: mockProjects.filter(p => p.city === 'Kolkata') },
  { name: 'Mumbai', projects: mockProjects.filter(p => p.city === 'Mumbai') },
  { name: 'Patna', projects: mockProjects.filter(p => p.city === 'Patna') },
  { name: 'Bangalore', projects: mockProjects.filter(p => p.city === 'Bangalore') },
];

export const mockHRs: HR[] = [
  { psn: hrPSNs.headHR, name: 'Dr. Evelyn Reed (Head)', role: 'Head HR', projectsHandled: mockProjects, priority: 1, ticketsResolved: 15, ticketsPending: 2  },
  { psn: hrPSNs.ramesh, name: 'Ramesh Kumar', role: 'HR', projectsHandled: mockProjects.filter(p=>p.city === 'Chennai' && ['CH001', 'CH002', 'CH003'].includes(p.id)), priority: 2, ticketsResolved: 10, ticketsPending: 3 },
  { psn: hrPSNs.sunita, name: 'Sunita Sharma', role: 'HR', projectsHandled: mockProjects.filter(p=>p.city === 'Chennai' && ['CH004', 'CH005'].includes(p.id)), priority: 2, ticketsResolved: 8, ticketsPending: 1 },
  { psn: hrPSNs.amit, name: 'Amit Singh', role: 'HR', projectsHandled: mockProjects.filter(p=>p.city === 'Delhi'), priority: 2, ticketsResolved: 12, ticketsPending: 2 },
  { psn: hrPSNs.priyaD, name: 'Priya Das', role: 'HR', projectsHandled: mockProjects.filter(p=>p.city === 'Kolkata'), priority: 2, ticketsResolved: 7, ticketsPending: 0 },
  { psn: hrPSNs.vijay, name: 'Vijay Patil', role: 'HR', projectsHandled: mockProjects.filter(p=>p.city === 'Mumbai' && ['MB001', 'MB002', 'MB005', 'MB007'].includes(p.id)), priority: 2, ticketsResolved: 11, ticketsPending: 4 },
  { psn: hrPSNs.anita, name: 'Anita Desai', role: 'HR', projectsHandled: mockProjects.filter(p=>p.city === 'Mumbai' && ['MB003', 'MB004', 'MB006'].includes(p.id)), priority: 2, ticketsResolved: 9, ticketsPending: 1 },
  { psn: hrPSNs.rajesh, name: 'Rajesh Gupta', role: 'HR', projectsHandled: mockProjects.filter(p=>p.city === 'Patna'), priority: 2, ticketsResolved: 6, ticketsPending: 1 },
];

// Function to get HR details for an employee based on project
const getHRForProject = (projectId: string): { hrPSN?: number; hrName?: string } => {
  const project = mockProjects.find(p => p.id === projectId);
  if (project && project.assignedHRs.length > 0) {
    const hr = mockHRs.find(h => h.psn === project.assignedHRs[0]);
    return { hrPSN: hr?.psn, hrName: hr?.name };
  }
  const headHR = mockHRs.find(h => h.role === 'Head HR');
  return { hrPSN: headHR?.psn, hrName: headHR?.name };
};


export const mockEmployees: Employee[] = [
  { psn: employeePSNs.aarav, name: 'Aarav Patel', role: 'Employee', project: 'CH001', grade: 'M1-A', gender: 'Male', ...getHRForProject('CH001') },
  { psn: employeePSNs.diya, name: 'Diya Mehta', role: 'Employee', project: 'CH004', grade: 'M2-B', gender: 'Female', ...getHRForProject('CH004') },
  { psn: employeePSNs.rohan, name: 'Rohan Joshi', role: 'Employee', project: 'DL001', grade: 'ET - Graduate', gender: 'Male', ...getHRForProject('DL001') },
  { psn: employeePSNs.sneha, name: 'Sneha Reddy', role: 'Employee', project: 'KL001', grade: 'S1', gender: 'Female', ...getHRForProject('KL001') },
  { psn: employeePSNs.vikram, name: 'Vikram Singh', role: 'Employee', project: 'MB001', grade: 'TC2', gender: 'Male', ...getHRForProject('MB001') },
  { psn: employeePSNs.priyaI, name: 'Priya Iyer', role: 'Employee', project: 'PT001', grade: 'O1', gender: 'Female', ...getHRForProject('PT001') },
  { psn: employeePSNs.arjun, name: 'Arjun Verma', role: 'Employee', project: 'BLR001', grade: 'PGET', gender: 'Male', ...getHRForProject('BLR001') },
  { psn: employeePSNs.meera, name: 'Meera Krishnan', role: 'Employee', project: 'MB006', grade: 'M3-C', gender: 'Female', ...getHRForProject('MB006') },
];


export const mockTickets: Ticket[] = [
  {
    id: generateTicketId(),
    psn: employeePSNs.aarav,
    employeeName: 'Aarav Patel',
    query: 'Unable to access project documents on the shared drive. Receiving an access denied error.',
    priority: 'High',
    dateOfQuery: '2024-05-01T10:00:00Z',
    status: 'Open',
    hrPSNAssigned: getHRForProject('CH001').hrPSN,
    project: 'CH001',
  },
  {
    id: generateTicketId(),
    psn: employeePSNs.diya,
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
    id: generateTicketId(),
    psn: employeePSNs.rohan,
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
    id: generateTicketId(),
    psn: employeePSNs.vikram,
    employeeName: 'Vikram Singh',
    query: 'Software license for CAD tool has expired. Need renewal.',
    priority: 'High',
    dateOfQuery: '2024-05-03T12:00:00Z',
    status: 'Open',
    hrPSNAssigned: getHRForProject('MB001').hrPSN,
    project: 'MB001',
  },
  {
    id: generateTicketId(),
    psn: employeePSNs.aarav,
    employeeName: 'Aarav Patel',
    query: 'Issue with VPN connection. Dropping frequently.',
    priority: 'Medium',
    dateOfQuery: '2024-05-04T09:15:00Z',
    status: 'Pending',
    hrPSNAssigned: getHRForProject('CH001').hrPSN,
    project: 'CH001',
    escalatedToPSN: hrPSNs.headHR, // Escalated to Head HR
  },
];
