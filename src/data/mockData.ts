
import type { Employee, Supervisor, Ticket, Project, JobCode, TicketStatus, User, TicketPriority } from '@/types';

export const mockProjects: Project[] = [
  { id: 'P001', name: 'Chennai Metro UG-05', city: 'Chennai' },
  { id: 'P002', name: 'Agra Metro DC09', city: 'Agra' },
  { id: 'P003', name: 'MAHSR C3 TL-1', city: 'Maharashtra' },
  { id: 'P004', name: 'Orange Gate Project', city: 'Maharashtra' },
  { id: 'P005', name: 'Kolkata Metro UGC-04', city: 'Kolkata' },
  { id: 'P006', name: 'Patna Metro PC-03', city: 'Patna' },
  { id: 'P007', name: 'Bangalore Metro RT02', city: 'Bangalore' },
];

export const mockCities: string[] = Array.from(new Set(mockProjects.map(p => p.city)));

export const mockGrades: string[] = [
    "M1-A", "M1-B", "M2-A", "M2-B", "M3-A", "M4-A", "O1", "O2", "S1", "GET", "MT", "FTC", "Retainer", "Expat"
].sort();

export const mockJobCodes: JobCode[] = [
    { id: "1100034", code: "1100034", description: "Project Manager" },
    { id: "1100178", code: "1100178", description: "Planning Manager" },
    { id: "1100028", code: "1100028", description: "Construction Manager" },
    { id: "1100332", code: "1100332", description: "Accounts Manager" },
    { id: "1100148", code: "1100148", description: "Accounts Executive" },
    { id: "7000089", code: "7000089", description: "IR Manager" },
    { id: "7000164", code: "7000164", description: "Civil Manager" },
    { id: "1100144", code: "1100144", description: "Engineer - Civil" },
    { id: "1100190", code: "1100190", description: "EHS Manager" },
    { id: "1100133", code: "1100133", description: "EHS Engineer" },
    { id: "1100509", code: "1100509", description: "Quality Manager" },
    { id: "1100385", code: "1100385", description: "Engineer - Quality" }
];


// --- Hardcoded Supervisors ---
export const mockSupervisors: Supervisor[] = [
  {
    psn: 20192584,
    name: "Uma Srinivasan",
    role: 'IC Head',
    functionalRole: 'IC Head',
    title: "IC Head",
    businessEmail: "20192584@lnthelpdesk.com",
    dateOfBirth: "1975-09-02",
    cityAccess: mockCities,
    branchProject: "P001",
    projectsHandledIds: mockProjects.map(p => p.id),
    ticketsResolved: 18,
    ticketsPending: 2,
  },
  {
    psn: 20076337,
    name: "Manish Kumar Agarwal",
    role: 'DH',
    functionalRole: 'DH',
    title: "Department Head",
    businessEmail: "20076337@lnthelpdesk.com",
    dateOfBirth: "1984-07-07",
    cityAccess: ['Maharashtra', 'Agra'],
    branchProject: "P003",
    projectsHandledIds: ["P002", "P003", "P004"],
    ticketsResolved: 15,
    ticketsPending: 3,
    dhPSN: 20192584,
    dhName: "Uma Srinivasan",
  },
  {
    psn: 85817,
    name: "Gopinath Alla",
    role: 'NS',
    functionalRole: 'NS',
    title: "Next Level Supervisor",
    businessEmail: "85817@lnthelpdesk.com",
    dateOfBirth: "1986-10-26",
    cityAccess: ['Chennai'],
    branchProject: "P001",
    projectsHandledIds: ["P001"],
    ticketsResolved: 12,
    ticketsPending: 1,
    dhPSN: 20076337,
    dhName: "Manish Kumar Agarwal",
  },
  {
    psn: 163389,
    name: "TSK Reddy",
    role: 'IS',
    functionalRole: 'IS',
    title: "Immediate Supervisor",
    businessEmail: "163389@lnthelpdesk.com",
    dateOfBirth: "1984-05-14",
    cityAccess: ['Chennai'],
    branchProject: "P001",
    projectsHandledIds: ["P001"],
    ticketsResolved: 9,
    ticketsPending: 4,
    nsPSN: 85817,
    nsName: "Gopinath Alla",
    dhPSN: 20076337,
    dhName: "Manish Kumar Agarwal",
  }
];

// --- Hardcoded Employees ---
export const mockEmployees: Employee[] = [
  {
    psn: 10004703,
    name: "Anurag P M",
    role: 'Employee',
    grade: "M2-B",
    jobCodeId: "1100144",
    project: "P003",
    businessEmail: "10004703@lnthelpdesk.com",
    dateOfBirth: "1989-05-01",
    isPSN: 85817,
    isName: "Gopinath Alla",
    nsPSN: 20076337,
    nsName: "Manish Kumar Agarwal",
    dhPSN: 20192584,
    dhName: "Uma Srinivasan"
  },
  {
    psn: 174885,
    name: "Deepak Prakash",
    role: 'Employee',
    grade: "M1-B",
    jobCodeId: "7000164",
    project: "P002",
    businessEmail: "174885@lnthelpdesk.com",
    dateOfBirth: "1992-04-17",
    isPSN: 85817,
    isName: "Gopinath Alla",
    nsPSN: 20076337,
    nsName: "Manish Kumar Agarwal",
    dhPSN: 20192584,
    dhName: "Uma Srinivasan"
  },
  {
    psn: 20060765,
    name: "Rangu Teja",
    role: 'Employee',
    grade: "M1-A",
    jobCodeId: "1100133",
    project: "P001",
    businessEmail: "20060765@lnthelpdesk.com",
    dateOfBirth: "1995-07-08",
    isPSN: 163389,
    isName: "TSK Reddy",
    nsPSN: 85817,
    nsName: "Gopinath Alla",
    dhPSN: 20192584,
    dhName: "Uma Srinivasan"
  },
  {
    psn: 20370213,
    name: "Rajat Jangir",
    role: 'Employee',
    grade: "GET",
    jobCodeId: "1100385",
    project: "P005",
    businessEmail: "20370213@lnthelpdesk.com",
    dateOfBirth: "2001-06-22",
    isPSN: 20076337,
    isName: "Manish Kumar Agarwal",
    nsPSN: 20192584,
    nsName: "Uma Srinivasan",
    dhPSN: 20192584,
    dhName: "Uma Srinivasan"
  },
  {
    psn: 20381176,
    name: "Hanzala Manzar",
    role: 'Employee',
    grade: "O2",
    jobCodeId: "1100178",
    project: "P003",
    businessEmail: "20381176@lnthelpdesk.com",
    dateOfBirth: "1998-02-03",
    isPSN: 85817,
    isName: "Gopinath Alla",
    nsPSN: 20076337,
    nsName: "Manish Kumar Agarwal",
    dhPSN: 20192584,
    dhName: "Uma Srinivasan"
  },
  {
    psn: 20395511,
    name: "Priya Sharma",
    role: 'Employee',
    grade: "S1",
    jobCodeId: "1100148", // Accounts Executive
    project: "P004", // Orange Gate Project
    businessEmail: "20395511@lnthelpdesk.com",
    dateOfBirth: "1997-11-30",
    isPSN: 163389,
    isName: "TSK Reddy",
    nsPSN: 85817,
    nsName: "Gopinath Alla",
    dhPSN: 20192584,
    dhName: "Uma Srinivasan"
  },
  {
    psn: 20401234,
    name: "Amit Patel",
    role: 'Employee',
    grade: "M1-A",
    jobCodeId: "1100028", // Construction Manager
    project: "P006", // Patna Metro
    businessEmail: "20401234@lnthelpdesk.com",
    dateOfBirth: "1990-01-15",
    isPSN: 20076337, // Manish Kumar Agarwal (acting as IS)
    isName: "Manish Kumar Agarwal",
    nsPSN: 20192584,
    nsName: "Uma Srinivasan",
    dhPSN: 20192584, // Also Uma
    dhName: "Uma Srinivasan"
  }
];

// --- Hardcoded Tickets ---
export const mockTickets: Ticket[] = [
  {
    id: "TKT0000001",
    psn: 10004703,
    employeeName: "Anurag P M",
    query: "My salary for last month has not been credited yet. Please check the status.",
    priority: 'Urgent',
    dateOfQuery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
    currentAssigneePSN: 85817,
    project: "P003",
    lastStatusUpdateDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TKT0000002",
    psn: 174885,
    employeeName: "Deepak Prakash",
    query: "Unable to access the new project management portal. Getting an authentication error.",
    priority: 'High',
    dateOfQuery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Progress',
    currentAssigneePSN: 20076337,
    project: "P002",
    actionPerformed: "Forwarded to IT team for portal access provisioning.",
    dateOfResponse: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastStatusUpdateDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TKT0000003",
    psn: 20060765,
    employeeName: "Rangu Teja",
    query: "Request for reimbursement of travel expenses for the site visit on 15th of last month.",
    priority: 'Medium',
    dateOfQuery: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Resolved',
    currentAssigneePSN: 163389,
    project: "P001",
    actionPerformed: "Reimbursement processed and approved. Amount will be credited in the next payroll.",
    dateOfResponse: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastStatusUpdateDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [{ id: `att-3`, fileName: `travel_bills.pdf`, fileType: 'document', urlOrContent: '#', uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }]
  },
    {
    id: "TKT0000004",
    psn: 20370213,
    employeeName: "Rajat Jangir",
    query: "Follow-up on the status of my new ID card application.",
    priority: 'Low',
    dateOfQuery: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Closed',
    currentAssigneePSN: 20076337,
    project: "P005",
    actionPerformed: "ID card has been dispatched. Please collect from the admin office.",
    dateOfResponse: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    lastStatusUpdateDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
    {
    id: "TKT0000005",
    psn: 10004703,
    employeeName: "Anurag P M",
    query: "Need access to the design documents for the MAHSR C3 project. My access seems to be revoked.",
    priority: 'High',
    dateOfQuery: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Escalated to DH',
    currentAssigneePSN: 20192584,
    project: "P003",
    actionPerformed: "Escalated by Gopinath Alla due to access permission level required.",
    dateOfResponse: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastStatusUpdateDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TKT0000006",
    psn: 20395511,
    employeeName: "Priya Sharma",
    query: "I have not received my Form-16 for the last financial year. Can you please provide an update?",
    priority: 'Medium',
    dateOfQuery: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    currentAssigneePSN: 163389,
    project: "P004",
    actionPerformed: "Checked with finance team. Awaiting their response.",
    dateOfResponse: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    lastStatusUpdateDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TKT0000007",
    psn: 20401234,
    employeeName: "Amit Patel",
    query: "Request for a new set of safety gear. My current helmet is damaged.",
    priority: 'High',
    dateOfQuery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
    currentAssigneePSN: 20076337,
    project: "P006",
    lastStatusUpdateDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const allMockUsers: User[] = [...mockEmployees, ...mockSupervisors];
