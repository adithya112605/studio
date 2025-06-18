
import type { Employee, Supervisor, Ticket, Project, City, JobCode, TicketStatus, User } from '@/types';

// --- PSN DEFINITIONS ---
const employeePSNs = {
  nagarajanS: 12345678,
  priyaRavi: 10000002,
  sureshK: 10000003,
  mohanLal: 10000020,
  deepakPatil: 10000030,
  anitaDas: 10000040,
  rajivKumar: 10000050,
};

const supervisorPSNs = {
  umaSrinivasan: 20192584,
  ganapathyRaman: 10004055,
  dhineshKathiravan: 20364848,
  payalRao: 20148345,
  rameshSubramanian: 20001001,
  arvindGupta: 20002001,
  sunilDesai: 20003001,
  kavitaSen: 20004001,
  vikasSharma: 20005001,
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
];

// --- PROJECTS ---
export const mockProjects: Project[] = [
  { id: 'P001', name: 'Chennai Metro UG-05', city: 'Chennai' },
  { id: 'P002', name: 'Chennai Metro UG-06', city: 'Chennai' },
  { id: 'P003', name: 'CMRL P1 TBM UG01', city: 'Chennai' },
  { id: 'P004', name: 'DMRC DC09', city: 'Agra' },
  { id: 'P005', name: 'RRTS Pkg 2 Tunnel', city: 'Agra' },
  { id: 'P006', name: 'RRTS Pkg 3 Ramp', city: 'Agra' },
  { id: 'P007', name: 'MAHSR C3 TL-1', city: 'Maharashtra' },
  { id: 'P008', name: 'MAHSR C3 TL-2', city: 'Maharashtra' },
  { id: 'P009', name: 'MAHSR C3 TL-3', city: 'Maharashtra' },
  { id: 'P010', name: 'MAHSR C5', city: 'Maharashtra' },
  { id: 'P011', name: 'Orange Gate', city: 'Maharashtra' },
  { id: 'P012', name: 'MMRC BKC & Dharavi', city: 'Maharashtra' },
  { id: 'P013', name: 'Kolkata Metro UGC-04', city: 'Kolkata' },
  { id: 'P014', name: 'Kolkata Metro UGC-06', city: 'Kolkata' },
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
export const mockSupervisors: Supervisor[] = [
  { psn: supervisorPSNs.umaSrinivasan, name: 'Uma Srinivasan', title: 'IC Head', functionalRole: 'IC Head', role: 'IC Head', cityAccess: mockCities.map(c => c.name), projectsHandledIds: mockProjects.map(p => p.id), ticketsResolved: 20, ticketsPending: 5, businessEmail: 'uma.srinivasan@lnt.co', dateOfBirth: '1975-03-10' },
  { psn: supervisorPSNs.ganapathyRaman, name: 'Ganapathy Raman', title: 'Cluster Head (DH)', functionalRole: 'DH', role: 'DH', cityAccess: ['Chennai', 'Kolkata', 'Patna'], projectsHandledIds: mockProjects.filter(p => ['Chennai', 'Kolkata', 'Patna'].includes(p.city)).map(p => p.id), branchProject: 'Regional Management (CKP)', ticketsResolved: 15, ticketsPending: 3, businessEmail: 'ganapathy.raman@lnt.co', dateOfBirth: '1980-07-22' },
  { psn: supervisorPSNs.dhineshKathiravan, name: 'Dhinesh Kathiravan', title: 'Cluster Head (DH)', functionalRole: 'DH', role: 'DH', cityAccess: ['Agra'], projectsHandledIds: mockProjects.filter(p => p.city === 'Agra').map(p => p.id), branchProject: 'Agra Operations', ticketsResolved: 10, ticketsPending: 2, businessEmail: 'dhinesh.kathiravan@lnt.co', dateOfBirth: '1982-11-05' },
  { psn: supervisorPSNs.payalRao, name: 'Payal Rao', title: 'Cluster Head (DH)', functionalRole: 'DH', role: 'DH', cityAccess: ['Maharashtra'], projectsHandledIds: mockProjects.filter(p => p.city === 'Maharashtra').map(p => p.id), branchProject: 'Maharashtra Operations', ticketsResolved: 12, ticketsPending: 1, businessEmail: 'payal.rao@lnt.co', dateOfBirth: '1978-01-15' },
  { psn: supervisorPSNs.rameshSubramanian, name: 'Ramesh Subramanian', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P001', projectsHandledIds: ['P001', 'P002', 'P003'], ticketsResolved: 5, ticketsPending: 1, businessEmail: 'ramesh.subramanian@lnt.co', dateOfBirth: '1985-06-30' },
  { psn: supervisorPSNs.arvindGupta, name: 'Arvind Gupta', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P004', projectsHandledIds: ['P004', 'P005', 'P006'], ticketsResolved: 3, ticketsPending: 0, businessEmail: 'arvind.gupta@lnt.co', dateOfBirth: '1988-09-12' },
  { psn: supervisorPSNs.sunilDesai, name: 'Sunil Desai', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P007', projectsHandledIds: ['P007','P008','P009','P010','P011','P012'], ticketsResolved: 4, ticketsPending: 1, businessEmail: 'sunil.desai@lnt.co', dateOfBirth: '1986-04-20' },
  { psn: supervisorPSNs.kavitaSen, name: 'Kavita Sen', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P013', projectsHandledIds: ['P013','P014'], ticketsResolved: 2, ticketsPending: 1, businessEmail: 'kavita.sen@lnt.co', dateOfBirth: '1990-02-25' },
  { psn: supervisorPSNs.vikasSharma, name: 'Vikas Sharma', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P015', projectsHandledIds: ['P015','P016'], ticketsResolved: 3, ticketsPending: 0, businessEmail: 'vikas.sharma@lnt.co', dateOfBirth: '1987-12-01' },
];

// --- EMPLOYEES ---
export const mockEmployees: Employee[] = [
  {
    psn: employeePSNs.nagarajanS, name: 'Nagarajan S', role: 'Employee', grade: 'E1', jobCodeId: 'JC003', project: 'P001',
    businessEmail: 'nagarajan.s@lnt.co', dateOfBirth: '1990-05-15',
    isPSN: supervisorPSNs.rameshSubramanian, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman,
  },
  {
    psn: employeePSNs.priyaRavi, name: 'Priya Ravichandran', role: 'Employee', grade: 'E2', jobCodeId: 'JC004', project: 'P002',
    businessEmail: 'priya.ravi@lnt.co', dateOfBirth: '1992-08-20',
    isPSN: supervisorPSNs.rameshSubramanian, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman,
  },
  {
    psn: employeePSNs.sureshK, name: 'Suresh K', role: 'Employee', grade: 'GET', jobCodeId: 'JC002', project: 'P003',
    businessEmail: 'suresh.k@lnt.co', dateOfBirth: '1995-11-10',
    isPSN: supervisorPSNs.rameshSubramanian, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman,
  },
  {
    psn: employeePSNs.mohanLal, name: 'Mohan Lal', role: 'Employee', grade: 'S1', jobCodeId: 'JC005', project: 'P004',
    businessEmail: 'mohan.lal@lnt.co', dateOfBirth: '1988-03-25',
    isPSN: supervisorPSNs.arvindGupta, nsPSN: supervisorPSNs.dhineshKathiravan, dhPSN: supervisorPSNs.dhineshKathiravan,
  },
  {
    psn: employeePSNs.deepakPatil, name: 'Deepak Patil', role: 'Employee', grade: 'E1', jobCodeId: 'JC003', project: 'P007',
    businessEmail: 'deepak.patil@lnt.co', dateOfBirth: '1991-07-01',
    isPSN: supervisorPSNs.sunilDesai, nsPSN: supervisorPSNs.payalRao, dhPSN: supervisorPSNs.payalRao,
  },
  {
    psn: employeePSNs.anitaDas, name: 'Anita Das', role: 'Employee', grade: 'TC2', jobCodeId: 'JC006', project: 'P013',
    businessEmail: 'anita.das@lnt.co', dateOfBirth: '1993-01-18',
    isPSN: supervisorPSNs.kavitaSen, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman,
  },
  {
    psn: employeePSNs.rajivKumar, name: 'Rajiv Kumar', role: 'Employee', grade: 'O1', jobCodeId: 'JC007', project: 'P015',
    businessEmail: 'rajiv.kumar@lnt.co', dateOfBirth: '1989-09-05',
    isPSN: supervisorPSNs.vikasSharma, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman,
  },
];

const getSupervisorName = (psn?: number): string | undefined => {
  if (!psn) return undefined;
  const supervisor = mockSupervisors.find(s => s.psn === psn);
  return supervisor?.name;
};

mockEmployees.forEach(emp => {
  emp.isName = getSupervisorName(emp.isPSN);
  emp.nsName = getSupervisorName(emp.nsPSN);
  emp.dhName = getSupervisorName(emp.dhPSN);
});

let ticketCounter = 1;
const generateTicketId = (): string => {
  const paddedCounter = ticketCounter.toString().padStart(7, '0');
  ticketCounter++;
  return `#TK${paddedCounter}`;
};

export const mockTickets: Ticket[] = [
  {
    id: generateTicketId(), psn: employeePSNs.nagarajanS, employeeName: 'Nagarajan S',
    query: 'Unable to access project documents on the shared drive. Receiving an access denied error for Chennai Metro UG-05 docs.',
    priority: 'High', dateOfQuery: '2024-05-01T10:00:00Z', status: 'Open' as TicketStatus,
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.nagarajanS)?.isPSN, project: 'P001',
  },
  {
    id: generateTicketId(), psn: employeePSNs.priyaRavi, employeeName: 'Priya Ravichandran',
    query: 'My salary for last month has not been credited yet. Please check. Project: Chennai Metro UG-06.',
    followUpQuery: 'This is a critical issue as I have outstanding payments.', priority: 'Urgent',
    dateOfQuery: '2024-05-02T14:30:00Z', status: 'In Progress' as TicketStatus,
    actionPerformed: 'Forwarded to payroll department by IS. Awaiting update.', dateOfResponse: '2024-05-03T09:00:00Z',
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.priyaRavi)?.isPSN, project: 'P002',
  },
  {
    id: generateTicketId(), psn: employeePSNs.mohanLal, employeeName: 'Mohan Lal',
    query: 'Request for safety helmet replacement. Current one is damaged. Project: DMRC DC09 Agra.',
    priority: 'Medium', dateOfQuery: '2024-05-03T11:00:00Z', status: 'Pending' as TicketStatus,
    actionPerformed: 'IS Arvind Gupta acknowledged. Checking inventory for replacement.', dateOfResponse: '2024-05-03T15:00:00Z',
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.mohanLal)?.isPSN, project: 'P004',
  },
   {
    id: generateTicketId(), psn: employeePSNs.deepakPatil, employeeName: 'Deepak Patil',
    query: 'Internet connectivity issues at MAHSR C3 TL-1 site office.', priority: 'High',
    dateOfQuery: '2024-05-04T09:00:00Z', status: 'Escalated to NS' as TicketStatus,
    actionPerformed: 'IS Sunil Desai attempted basic troubleshooting. Issue persists. Escalated to NS Payal Rao for IT infra check.',
    dateOfResponse: '2024-05-04T14:00:00Z',
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.deepakPatil)?.nsPSN, project: 'P007',
  },
  {
    id: generateTicketId(), psn: employeePSNs.anitaDas, employeeName: 'Anita Das',
    query: 'Leave balance discrepancy in the portal for Kolkata Metro UGC-04.', priority: 'Medium',
    dateOfQuery: '2024-05-05T16:00:00Z', status: 'Resolved' as TicketStatus,
    actionPerformed: 'IS Kavita Sen verified records and corrected leave balance. Employee confirmed.', dateOfResponse: '2024-05-06T10:00:00Z',
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.anitaDas)?.isPSN, project: 'P013',
  },
];

export const allMockUsers: User[] = [...mockEmployees, ...mockSupervisors];
