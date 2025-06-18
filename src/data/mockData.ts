
import type { Employee, Supervisor, Ticket, Project, City, JobCode, TicketStatus } from '@/types';

// --- PSN DEFINITIONS ---
// Employees (Example PSNs from image - will map to actual from image)
const employeePSNs = {
  // Chennai
  nagarajanS: 10000001, // Nagarajan S (Example, replace with actual)
  priyaRavi: 10000002,
  sureshK: 10000003,
  // ... more from image
  // Agra
  mohanLal: 10000020,
  // Maharashtra
  deepakPatil: 10000030,
  // Kolkata
  anitaDas: 10000040,
  // Patna
  rajivKumar: 10000050,
};

// Supervisors (PSNs from image and notes)
const supervisorPSNs = {
  // IC Head
  umaSrinivasan: 20192584,
  // DHs
  ganapathyRaman: 10004055, // Chennai, Kolkata, Patna
  dhineshKathiravan: 20364848, // Agra
  payalRao: 20148345, // Maharashtra
  // IS/NS (examples, will be derived from employee data)
  rameshSubramanian: 20001001, // Example IS for Chennai
  arvindGupta: 20002001, // Example IS for Agra
  sunilDesai: 20003001, // Example IS for Maharashtra
  kavitaSen: 20004001, // Example IS for Kolkata
  vikasSharma: 20005001, // Example IS for Patna
  // Adding NS examples based on structure (often same as DH for smaller chains)
};


// --- JOB CODES ---
export const mockJobCodes: JobCode[] = [
  { id: 'JC001', code: 'M1-A', description: 'Manager Grade 1A' },
  { id: 'JC002', code: 'GET', description: 'Graduate Engineer Trainee' },
  { id: 'JC003', code: 'E1', description: 'Engineer Grade 1' },
  { id: 'JC004', code: 'E2', description: 'Engineer Grade 2' },
  { id: 'JC005', code: 'S1', description: 'Supervisor Grade 1' },
  { id: 'JC006', code: 'TC2', description: 'Technician Grade 2' },
  { id: 'JC007', code: 'O1', description: 'Officer Grade 1' },
  { id: 'JC008', code: 'PGET', description: 'Post Graduate Engineer Trainee' },
  { id: 'JC009', code: 'M3-C', description: 'Manager Grade 3C' },
  { id: 'JC010', code: 'SE', description: 'Senior Engineer' },
  { id: 'JC011', code: 'PM', description: 'Project Manager' },
  { id: 'JC012', code: 'DPM', description: 'Deputy Project Manager' },
  { id: 'JC013', code: 'CM', description: 'Cluster Manager' },
  { id: 'JC014', code: 'CH', description: 'Cluster Head' },
  { id: 'JC015', code: 'SI', description: 'Site Incharge' },
  { id: 'JC016', code: 'PLM', description: 'Planning Manager'},
  { id: 'JC017', code: 'ADM', description: 'Admin Staff'},
  { id: 'JC018', code: 'EXEC', description: 'Executive'},

  // Add all unique job codes from the Excel image
];

// --- PROJECTS ---
// Ensure these IDs are unique and simple (e.g., P001, P002)
export const mockProjects: Project[] = [
  // Chennai
  { id: 'P001', name: 'Chennai Metro UG-05', city: 'Chennai' },
  { id: 'P002', name: 'Chennai Metro UG-06', city: 'Chennai' },
  { id: 'P003', name: 'CMRL P1 TBM UG01', city: 'Chennai' },
  // Agra
  { id: 'P004', name: 'DMRC DC09', city: 'Agra' },
  { id: 'P005', name: 'RRTS Pkg 2 Tunnel', city: 'Agra' },
  { id: 'P006', name: 'RRTS Pkg 3 Ramp', city: 'Agra' },
  // Maharashtra
  { id: 'P007', name: 'MAHSR C3 TL-1', city: 'Maharashtra' },
  { id: 'P008', name: 'MAHSR C3 TL-2', city: 'Maharashtra' },
  { id: 'P009', name: 'MAHSR C3 TL-3', city: 'Maharashtra' },
  { id: 'P010', name: 'MAHSR C5', city: 'Maharashtra' },
  { id: 'P011', name: 'Orange Gate', city: 'Maharashtra' },
  { id: 'P012', name: 'MMRC BKC & Dharavi', city: 'Maharashtra' },
  // Kolkata
  { id: 'P013', name: 'Kolkata Metro UGC-04', city: 'Kolkata' },
  { id: 'P014', name: 'Kolkata Metro UGC-06', city: 'Kolkata' },
  // Patna
  { id: 'P015', name: 'Patna Metro PC-03', city: 'Patna' },
  { id: 'P016', name: 'Patna Metro PC-08', city: 'Patna' },
];

export const mockCities: City[] = [
  { name: 'Chennai', projects: mockProjects.filter(p => p.city === 'Chennai') },
  { name: 'Agra', projects: mockProjects.filter(p => p.city === 'Agra') },
  { name: 'Maharashtra', projects: mockProjects.filter(p => p.city === 'Maharashtra') },
  { name: 'Kolkata', projects: mockProjects.filter(p => p.city === 'Kolkata') },
  { name: 'Patna', projects: mockProjects.filter(p => p.city === 'Patna') },
];

// --- SUPERVISORS ---
// Note: projectsHandledIds for DH/IC Head should cover all projects in their cityAccess or all projects respectively.
// For IS/NS, it can be the specific projects their direct reports are on.
export const mockSupervisors: Supervisor[] = [
  // IC Head
  { psn: supervisorPSNs.umaSrinivasan, name: 'Uma Srinivasan', title: 'IC Head', functionalRole: 'IC Head', cityAccess: mockCities.map(c => c.name), projectsHandledIds: mockProjects.map(p => p.id), ticketsResolved: 20, ticketsPending: 5, businessEmail: 'uma.srinivasan@lnt.co' },
  // DHs
  { psn: supervisorPSNs.ganapathyRaman, name: 'Ganapathy Raman', title: 'Cluster Head', functionalRole: 'DH', cityAccess: ['Chennai', 'Kolkata', 'Patna'], projectsHandledIds: mockProjects.filter(p => ['Chennai', 'Kolkata', 'Patna'].includes(p.city)).map(p => p.id), branchProject: 'Regional Management', ticketsResolved: 15, ticketsPending: 3, businessEmail: 'ganapathy.raman@lnt.co' },
  { psn: supervisorPSNs.dhineshKathiravan, name: 'Dhinesh Kathiravan', title: 'Cluster Head', functionalRole: 'DH', cityAccess: ['Agra'], projectsHandledIds: mockProjects.filter(p => p.city === 'Agra').map(p => p.id), branchProject: 'Agra Operations', ticketsResolved: 10, ticketsPending: 2, businessEmail: 'dhinesh.kathiravan@lnt.co' },
  { psn: supervisorPSNs.payalRao, name: 'Payal Rao', title: 'Cluster Head', functionalRole: 'DH', cityAccess: ['Maharashtra'], projectsHandledIds: mockProjects.filter(p => p.city === 'Maharashtra').map(p => p.id), branchProject: 'Maharashtra Operations', ticketsResolved: 12, ticketsPending: 1, businessEmail: 'payal.rao@lnt.co' },

  // Example IS/NS from Excel data (to be populated by parsing the image)
  // For Ramesh Subramanian (IS for some Chennai employees)
  { psn: supervisorPSNs.rameshSubramanian, name: 'Ramesh Subramanian', title: 'Site Incharge', functionalRole: 'IS', branchProject: 'Chennai Metro UG-05', projectsHandledIds: ['P001'], ticketsResolved: 5, ticketsPending: 1, businessEmail: 'ramesh.subramanian@lnt.co' },
  // Add other IS/NS based on parsing employee hierarchy from the Excel image
  // Example: If an employee's IS_PSNO is X, and NS_PSNO is Y (and Y is not a DH), then:
  // Supervisor X: title="Site Incharge" (or similar), functionalRole='IS'
  // Supervisor Y: title="Project Manager" (or similar), functionalRole='NS'

  // This section needs to be meticulously populated based on the Excel.
  // The supervisors listed in the Employee table (IS_NAME, NS_NAME, DH_NAME columns) need to be added here
  // with their correct PSN, Name, Title (from their Job Code if they are also an employee, or a generic title),
  // and FunctionalRole ('IS', 'NS', 'DH').
  // For now, these are illustrative.
];


// --- EMPLOYEES ---
// This requires careful transcription from the Excel image.
export const mockEmployees: Employee[] = [
  // Example based on structure and Excel hints. This needs to be fully populated.
  {
    psn: 12345678, name: 'Nagarajan S', role: 'Employee', grade: 'E1', jobCodeId: 'JC003', project: 'P001', // Chennai Metro UG-05
    businessEmail: 'nagarajan.s@lnt.co',
    isPSN: supervisorPSNs.rameshSubramanian, isName: 'Ramesh Subramanian',
    nsPSN: supervisorPSNs.ganapathyRaman, nsName: 'Ganapathy Raman', // Assuming Ganapathy Raman is also NS for some
    dhPSN: supervisorPSNs.ganapathyRaman, dhName: 'Ganapathy Raman',
  },
  {
    psn: 12345679, name: 'Priya Ravichandran', role: 'Employee', grade: 'E2', jobCodeId: 'JC004', project: 'P002', // Chennai Metro UG-06
    businessEmail: 'priya.ravi@lnt.co',
    isPSN: supervisorPSNs.rameshSubramanian, isName: 'Ramesh Subramanian',
    nsPSN: supervisorPSNs.ganapathyRaman, nsName: 'Ganapathy Raman',
    dhPSN: supervisorPSNs.ganapathyRaman, dhName: 'Ganapathy Raman',
  },
  // ... more employees from Chennai, Agra, Maharashtra, Kolkata, Patna based on Excel image
  // Ensure all employees from the Excel image are added here, with correct IS, NS, DH links (PSNs).
];

// Helper to find a supervisor's name by PSN
const getSupervisorName = (psn?: number): string | undefined => {
  if (!psn) return undefined;
  const supervisor = mockSupervisors.find(s => s.psn === psn);
  return supervisor?.name;
};

// Populate IS/NS/DH names in mockEmployees (run once after both arrays are defined)
mockEmployees.forEach(emp => {
  emp.isName = getSupervisorName(emp.isPSN);
  emp.nsName = getSupervisorName(emp.nsPSN);
  emp.dhName = getSupervisorName(emp.dhPSN);
});


// --- TICKETS ---
// Function to generate new Ticket IDs
const generateTicketId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `#TK${result}`;
};

export const mockTickets: Ticket[] = [
  {
    id: generateTicketId(),
    psn: mockEmployees.length > 0 ? mockEmployees[0].psn : 0, // Employee PSN
    employeeName: mockEmployees.length > 0 ? mockEmployees[0].name : 'Test Employee',
    query: 'Unable to access project documents on the shared drive. Receiving an access denied error.',
    priority: 'High',
    dateOfQuery: '2024-05-01T10:00:00Z',
    status: 'Open' as TicketStatus,
    currentAssigneePSN: mockEmployees.length > 0 ? mockEmployees[0].isPSN : undefined, // Assigned to IS initially
    project: mockEmployees.length > 0 ? mockEmployees[0].project : 'P000',
  },
  {
    id: generateTicketId(),
    psn: mockEmployees.length > 1 ? mockEmployees[1].psn : 0,
    employeeName: mockEmployees.length > 1 ? mockEmployees[1].name : 'Another Employee',
    query: 'My salary for last month has not been credited yet. Please check.',
    followUpQuery: 'This is a critical issue as I have outstanding payments.',
    priority: 'Urgent',
    dateOfQuery: '2024-05-02T14:30:00Z',
    status: 'In Progress' as TicketStatus,
    actionPerformed: 'Forwarded to payroll department. Awaiting update.',
    dateOfResponse: '2024-05-03T09:00:00Z',
    currentAssigneePSN: mockEmployees.length > 1 ? mockEmployees[1].isPSN : undefined,
    project: mockEmployees.length > 1 ? mockEmployees[1].project : 'P000',
  },
  // Add more tickets, ensuring currentAssigneePSN reflects the new logic (IS by default)
];

// Ensure all supervisor PSNs used in employee records (isPSN, nsPSN, dhPSN)
// are present in the mockSupervisors array with their correct details.
// This is a placeholder for the actual data entry from the Excel image.
// You will need to manually parse the Excel image and populate mockEmployees and mockSupervisors thoroughly.
// For example, for each employee in Excel:
// 1. Add them to mockEmployees.
// 2. Identify their IS, NS, DH PSNs and Names.
// 3. Ensure these supervisors (IS, NS, DH) exist in mockSupervisors. If not, add them.
//    - Their 'title' can be their job_code from the employee list if they are also an employee, or a generic title.
//    - Their 'functionalRole' is 'IS', 'NS', or 'DH' based on how they appear in the hierarchy.
//    - 'branchProject' can be the project they manage or are associated with.
//    - 'cityAccess' and 'projectsHandledIds' are primarily for DHs and IC Head.
//
// This mockData.ts file will be very large once fully populated from the Excel.
// The current mock data is just a structural example and needs to be replaced with actual data.
