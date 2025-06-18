
import type { Employee, Supervisor, Ticket, Project, City, JobCode, TicketStatus, User } from '@/types';

// Helper function to parse and format dates
function parseAndFormatDate(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  try {
    // Normalize separators to /
    const normalizedDateStr = dateStr.replace(/-/g, '/');
    const parts = normalizedDateStr.split('/');
    
    let day, month, year;

    // Common formats: MM/DD/YYYY or DD/MM/YYYY
    if (parts.length === 3) {
        const part0 = parseInt(parts[0], 10);
        const part1 = parseInt(parts[1], 10);
        const part2 = parseInt(parts[2], 10);

        if (part0 > 0 && part0 <= 12 && part1 > 0 && part1 <= 31 && (parts[2]?.length === 4 || parts[2]?.length === 2)) { // Likely MM/DD/YYYY or MM/DD/YY
            month = parts[0].padStart(2, '0');
            day = parts[1].padStart(2, '0');
            year = parts[2].length === 2 ? (part2 < 70 ? '20' + parts[2] : '19' + parts[2]) : parts[2];
        } else if (part0 > 0 && part0 <= 31 && part1 > 0 && part1 <= 12 && (parts[2]?.length === 4 || parts[2]?.length === 2)) { // Likely DD/MM/YYYY or DD/MM/YY
            day = parts[0].padStart(2, '0');
            month = parts[1].padStart(2, '0');
            year = parts[2].length === 2 ? (part2 < 70 ? '20' + parts[2] : '19' + parts[2]) : parts[2];
        }

        if (year && month && day &&
            parseInt(year, 10) > 1900 && parseInt(year, 10) <= new Date().getFullYear() && // Basic year sanity check
            parseInt(month, 10) > 0 && parseInt(month, 10) <= 12 &&
            parseInt(day, 10) > 0 && parseInt(day, 10) <= 31) {
          // Final check for day validity in month (simple version)
          const testDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
          if (testDate.getFullYear() === parseInt(year, 10) && testDate.getMonth() === (parseInt(month, 10) - 1) && testDate.getDate() === parseInt(day, 10)) {
            return `${year}-${month}-${day}`;
          }
        }
    }
  } catch (e) {
    // console.warn(`Could not parse date: ${dateStr}`, e);
    return undefined;
  }
  // console.warn(`Could not parse date, returning undefined for: ${dateStr}`);
  return undefined; // Fallback
}


const providedDOBsRaw = [
  "05-01-1989", "10/26/1986", "05/14/1984", "07-07-1984", "10/29/1983",
  "04-03-1989", "04/17/1992", // For employees (7)
  "07-08-1995", "09-02-1975", "02/24/1969", "08-07-1974", "05-04-1994",
  "04/28/1995", "06/15/1970", "10/28/1996", "06/28/2002" // For supervisors (9)
];

const formattedDOBs = providedDOBsRaw.map(parseAndFormatDate);


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

// --- GRADES ---
export const mockGrades: string[] = [
  "CA1", "CMA", "DET", "ET - Graduate", "Expat", "FLS - Trainee", "FTC", "GCT", "GET", "GST", 
  "ITI TRAINEE", "M1-A", "M1-B", "M1-C", "M2-A", "M2-B", "M2-C", "M3-A", "M3-B", "M3-C",
  "M4-A", "M4-B", "M4-C", "MT", "O1", "O2", "O3", "PGET", "PGET-NICMAR", "PGT", 
  "Retainer", "S1", "S2", "TC2", "TC3", "TC4", "TC5", "TC6", "TC7", "TC8", "TC9"
].sort();


// --- JOB CODES ---
export const mockJobCodes: JobCode[] = [
  { id: 'JC001', code: 'M1-A', description: 'Manager Grade 1A' },
  { id: 'JC002', code: 'GET', description: 'Graduate Engineer Trainee' },
  { id: 'JC003', code: 'E1', description: 'Engineer Grade 1' }, // Changed from M1-A as it was a duplicate code
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
  { psn: supervisorPSNs.umaSrinivasan, name: 'Uma Srinivasan', title: 'IC Head', functionalRole: 'IC Head', role: 'IC Head', cityAccess: mockCities.map(c => c.name), projectsHandledIds: mockProjects.map(p => p.id), ticketsResolved: 20, ticketsPending: 5, businessEmail: 'uma.srinivasan@lnt.co', dateOfBirth: formattedDOBs[7] },
  { psn: supervisorPSNs.ganapathyRaman, name: 'Ganapathy Raman', title: 'Cluster Head (DH)', functionalRole: 'DH', role: 'DH', cityAccess: ['Chennai', 'Kolkata', 'Patna'], projectsHandledIds: mockProjects.filter(p => ['Chennai', 'Kolkata', 'Patna'].includes(p.city)).map(p => p.id), branchProject: 'Regional Management (CKP)', ticketsResolved: 15, ticketsPending: 3, businessEmail: 'ganapathy.raman@lnt.co', dateOfBirth: formattedDOBs[8] },
  { psn: supervisorPSNs.dhineshKathiravan, name: 'Dhinesh Kathiravan', title: 'Cluster Head (DH)', functionalRole: 'DH', role: 'DH', cityAccess: ['Agra'], projectsHandledIds: mockProjects.filter(p => p.city === 'Agra').map(p => p.id), branchProject: 'Agra Operations', ticketsResolved: 10, ticketsPending: 2, businessEmail: 'dhinesh.kathiravan@lnt.co', dateOfBirth: formattedDOBs[9] },
  { psn: supervisorPSNs.payalRao, name: 'Payal Rao', title: 'Cluster Head (DH)', functionalRole: 'DH', role: 'DH', cityAccess: ['Maharashtra'], projectsHandledIds: mockProjects.filter(p => p.city === 'Maharashtra').map(p => p.id), branchProject: 'Maharashtra Operations', ticketsResolved: 12, ticketsPending: 1, businessEmail: 'payal.rao@lnt.co', dateOfBirth: formattedDOBs[10] },
  { psn: supervisorPSNs.rameshSubramanian, name: 'Ramesh Subramanian', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P001', projectsHandledIds: ['P001', 'P002', 'P003'], ticketsResolved: 5, ticketsPending: 1, businessEmail: 'ramesh.subramanian@lnt.co', dateOfBirth: formattedDOBs[11] },
  { psn: supervisorPSNs.arvindGupta, name: 'Arvind Gupta', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P004', projectsHandledIds: ['P004', 'P005', 'P006'], ticketsResolved: 3, ticketsPending: 0, businessEmail: 'arvind.gupta@lnt.co', dateOfBirth: formattedDOBs[12] },
  { psn: supervisorPSNs.sunilDesai, name: 'Sunil Desai', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P007', projectsHandledIds: ['P007','P008','P009','P010','P011','P012'], ticketsResolved: 4, ticketsPending: 1, businessEmail: 'sunil.desai@lnt.co', dateOfBirth: formattedDOBs[13] },
  { psn: supervisorPSNs.kavitaSen, name: 'Kavita Sen', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P013', projectsHandledIds: ['P013','P014'], ticketsResolved: 2, ticketsPending: 1, businessEmail: 'kavita.sen@lnt.co', dateOfBirth: formattedDOBs[14] },
  { psn: supervisorPSNs.vikasSharma, name: 'Vikas Sharma', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P015', projectsHandledIds: ['P015','P016'], ticketsResolved: 3, ticketsPending: 0, businessEmail: 'vikas.sharma@lnt.co', dateOfBirth: formattedDOBs[15] },
];

// --- EMPLOYEES ---
export const mockEmployees: Employee[] = [
  {
    psn: employeePSNs.nagarajanS, name: 'Nagarajan S', role: 'Employee', grade: 'M1-A', jobCodeId: 'JC003', project: 'P001',
    businessEmail: 'nagarajan.s@lnt.co', dateOfBirth: formattedDOBs[0],
    isPSN: supervisorPSNs.rameshSubramanian, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman,
  },
  {
    psn: employeePSNs.priyaRavi, name: 'Priya Ravichandran', role: 'Employee', grade: 'M2-A', jobCodeId: 'JC004', project: 'P002',
    businessEmail: 'priya.ravi@lnt.co', dateOfBirth: formattedDOBs[1],
    isPSN: supervisorPSNs.rameshSubramanian, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman,
  },
  {
    psn: employeePSNs.sureshK, name: 'Suresh K', role: 'Employee', grade: 'GET', jobCodeId: 'JC002', project: 'P003',
    businessEmail: 'suresh.k@lnt.co', dateOfBirth: formattedDOBs[2],
    isPSN: supervisorPSNs.rameshSubramanian, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman,
  },
  {
    psn: employeePSNs.mohanLal, name: 'Mohan Lal', role: 'Employee', grade: 'S1', jobCodeId: 'JC005', project: 'P004',
    businessEmail: 'mohan.lal@lnt.co', dateOfBirth: formattedDOBs[3],
    isPSN: supervisorPSNs.arvindGupta, nsPSN: supervisorPSNs.dhineshKathiravan, dhPSN: supervisorPSNs.dhineshKathiravan,
  },
  {
    psn: employeePSNs.deepakPatil, name: 'Deepak Patil', role: 'Employee', grade: 'M1-B', jobCodeId: 'JC003', project: 'P007', // Grade was M3-C, changed to M1-B as JC003 is E1
    businessEmail: 'deepak.patil@lnt.co', dateOfBirth: formattedDOBs[4],
    isPSN: supervisorPSNs.sunilDesai, nsPSN: supervisorPSNs.payalRao, dhPSN: supervisorPSNs.payalRao,
  },
  {
    psn: employeePSNs.anitaDas, name: 'Anita Das', role: 'Employee', grade: 'TC2', jobCodeId: 'JC006', project: 'P013',
    businessEmail: 'anita.das@lnt.co', dateOfBirth: formattedDOBs[5],
    isPSN: supervisorPSNs.kavitaSen, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman,
  },
  {
    psn: employeePSNs.rajivKumar, name: 'Rajiv Kumar', role: 'Employee', grade: 'O1', jobCodeId: 'JC007', project: 'P015',
    businessEmail: 'rajiv.kumar@lnt.co', dateOfBirth: formattedDOBs[6],
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
const generateTicketIdForMock = (): string => { 
  const paddedCounter = ticketCounter.toString().padStart(7, '0');
  ticketCounter++;
  return `#TK${paddedCounter}`;
};

export const mockTickets: Ticket[] = [
  {
    id: generateTicketIdForMock(), psn: employeePSNs.nagarajanS, employeeName: 'Nagarajan S',
    query: 'Unable to access project documents on the shared drive. Receiving an access denied error for Chennai Metro UG-05 docs.',
    priority: 'High', dateOfQuery: '2024-05-01T10:00:00Z', status: 'Open' as TicketStatus,
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.nagarajanS)?.isPSN, project: 'P001',
    lastStatusUpdateDate: '2024-05-01T10:00:00Z',
  },
  {
    id: generateTicketIdForMock(), psn: employeePSNs.priyaRavi, employeeName: 'Priya Ravichandran',
    query: 'My salary for last month has not been credited yet. Please check. Project: Chennai Metro UG-06.',
    followUpQuery: 'This is a critical issue as I have outstanding payments.', priority: 'Urgent',
    dateOfQuery: '2024-05-02T14:30:00Z', status: 'In Progress' as TicketStatus,
    actionPerformed: 'Forwarded to payroll department by IS. Awaiting update.', dateOfResponse: '2024-05-03T09:00:00Z',
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.priyaRavi)?.isPSN, project: 'P002',
    lastStatusUpdateDate: '2024-05-03T09:00:00Z',
  },
  {
    id: generateTicketIdForMock(), psn: employeePSNs.mohanLal, employeeName: 'Mohan Lal',
    query: 'Request for safety helmet replacement. Current one is damaged. Project: DMRC DC09 Agra.',
    priority: 'Medium', dateOfQuery: '2024-05-03T11:00:00Z', status: 'Pending' as TicketStatus,
    actionPerformed: 'IS Arvind Gupta acknowledged. Checking inventory for replacement.', dateOfResponse: '2024-05-03T15:00:00Z',
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.mohanLal)?.isPSN, project: 'P004',
    lastStatusUpdateDate: '2024-05-03T15:00:00Z',
  },
   {
    id: generateTicketIdForMock(), psn: employeePSNs.deepakPatil, employeeName: 'Deepak Patil',
    query: 'Internet connectivity issues at MAHSR C3 TL-1 site office.', priority: 'High',
    dateOfQuery: '2024-05-04T09:00:00Z', status: 'Escalated to NS' as TicketStatus,
    actionPerformed: 'IS Sunil Desai attempted basic troubleshooting. Issue persists. Escalated to NS Payal Rao for IT infra check.',
    dateOfResponse: '2024-05-04T14:00:00Z',
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.deepakPatil)?.nsPSN, project: 'P007',
    lastStatusUpdateDate: '2024-05-04T14:00:00Z',
  },
  {
    id: generateTicketIdForMock(), psn: employeePSNs.anitaDas, employeeName: 'Anita Das',
    query: 'Leave balance discrepancy in the portal for Kolkata Metro UGC-04.', priority: 'Medium',
    dateOfQuery: '2024-05-05T16:00:00Z', status: 'Resolved' as TicketStatus,
    actionPerformed: 'IS Kavita Sen verified records and corrected leave balance. Employee confirmed.', dateOfResponse: '2024-05-06T10:00:00Z',
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.anitaDas)?.isPSN, project: 'P013',
    lastStatusUpdateDate: '2024-05-06T10:00:00Z',
  },
  {
    id: generateTicketIdForMock(), psn: employeePSNs.sureshK, employeeName: 'Suresh K',
    query: 'Need access to specific training materials for CMRL P1 TBM UG01. Not found in portal.',
    priority: 'Medium', dateOfQuery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), 
    status: 'Open' as TicketStatus,
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.sureshK)?.isPSN, project: 'P003',
    lastStatusUpdateDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
   {
    id: generateTicketIdForMock(), psn: employeePSNs.nagarajanS, employeeName: 'Nagarajan S',
    query: 'Follow up: Still no access to project documents. This is blocking my work.',
    priority: 'Urgent', dateOfQuery: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), 
    status: 'Escalated to NS' as TicketStatus,
    actionPerformed: 'IS escalated due to no resolution.',
    dateOfResponse: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    currentAssigneePSN: mockEmployees.find(e=> e.psn === employeePSNs.nagarajanS)?.nsPSN, project: 'P001',
    lastStatusUpdateDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const allMockUsers: User[] = [...mockEmployees, ...mockSupervisors];

    