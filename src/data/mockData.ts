
import type { Employee, Supervisor, Ticket, Project, City, JobCode, TicketStatus, User, TicketPriority } from '@/types';

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

const userProvidedDatesRaw = [
  "05-01-1989", "10/26/1986", "05/14/1984", "07-07-1984", "10/29/1983", "04-03-1989", "04/17/1992",
  "07-08-1995", "09-02-1975", "02/24/1969", "08-07-1974", "05-04-1994", "04/28/1995", "06/15/1970", "10/28/1996", "06/28/2002",
  "07-01-2002", "01/15/2004", "12-11-2001", "12/31/2002", "06/22/2001", "01/21/1985", "11/22/1960", "11/13/1994",
  "01-10-2000", "07-07-2001", "07-02-1998", "06/24/1973", "11/16/1982", "05-12-1992", "05/18/1974", "07-02-1970",
  "08-05-1993", "08/27/1986", "03/26/1987", "02/17/1973", "10/15/1975", "05-01-1977", "12/21/1980", "08/21/1973",
  "10-01-1969", "06-01-1967", "12/27/1972", "05/16/1970", "10/23/1971", "09-02-1969", "05-02-1980", "02-03-1973",
  "10/18/1984", "05/28/1984", "04-05-1988", "06-05-1970", "06/28/1969", "02/19/1985", "08/15/1983", "07-05-1971",
  "06/15/1981", "12/17/1989", "06/15/1988", "06/19/1979", "06/13/1981", "12/13/1984", "02/24/1972", "08/15/1979",
  "01-10-1992", "10-08-1989", "02-03-1977", "12-03-1976", "02/27/1972", "01/21/1971", "02/18/1974", "06/30/1986",
  "06-05-1993", "04/28/1986", "03-08-1992", "09-03-1970", "03/22/1978", "01/28/1994", "04/26/1994", "08/31/1979",
  "08/21/1968", "10-10-1994", "05-12-1978", "05/30/1972", "05/26/1974", "09-08-1995", "04-10-1995", "10/18/1995",
  "02-10-1978", "01/18/1980", "05-01-1968", "05-02-1971", "07-01-1975", "08-06-1971", "05-01-1974", "04-06-1967",
  "02-08-1969", "03/15/1982", "04/20/1983", "01-09-1979", "04-11-1985", "04/20/1980", "11/16/1981", "11/29/1979",
  "04/17/1968", "05/19/1984", "06-05-1981", "11/18/1986", "07-01-1979", "05-05-1976", "02-03-1998", "07/26/1983",
  "09/22/1974", "10-02-1997", "12/20/1994", "06/20/1997", "05/15/1979", "12/30/1988", "11-02-1988", "05-04-1986",
  "10-08-1998", "05/21/1999", "01/31/1999", "03-05-1968", "07/20/1982", "03/13/1999", "08/16/1999", "05-04-1971",
  "12-07-1998", "01-03-1978", "02-11-1997", "09-06-1970", "07/18/1976", "04-02-1999", "09/27/1999", "06/19/1995",
  "11/16/1968", "11/23/2000", "08/17/1999", "09/16/1998", "01/18/1986", "01/20/1981", "12-10-1976", "07-06-1977",
  "04/20/1978", "07-01-1976", "02-05-1994", "02/14/1987", "08-02-1983", "04/20/1994", "02/25/1987", "09-03-1980"
]; // Total 150 dates

const formattedDOBs = userProvidedDatesRaw.map(parseAndFormatDate);

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
// Base definitions for supervisors (DOBs will be overwritten)
const baseSupervisors: Omit<Supervisor, 'dateOfBirth'>[] = [
  { psn: supervisorPSNs.umaSrinivasan, name: 'Uma Srinivasan', title: 'IC Head', functionalRole: 'IC Head', role: 'IC Head', cityAccess: mockCities.map(c => c.name), projectsHandledIds: mockProjects.map(p => p.id), ticketsResolved: 20, ticketsPending: 5, businessEmail: 'uma.srinivasan@lnt.co' },
  { psn: supervisorPSNs.ganapathyRaman, name: 'Ganapathy Raman', title: 'Cluster Head (DH)', functionalRole: 'DH', role: 'DH', cityAccess: ['Chennai', 'Kolkata', 'Patna'], projectsHandledIds: mockProjects.filter(p => ['Chennai', 'Kolkata', 'Patna'].includes(p.city)).map(p => p.id), branchProject: 'Regional Management (CKP)', ticketsResolved: 15, ticketsPending: 3, businessEmail: 'ganapathy.raman@lnt.co' },
  { psn: supervisorPSNs.dhineshKathiravan, name: 'Dhinesh Kathiravan', title: 'Cluster Head (DH)', functionalRole: 'DH', role: 'DH', cityAccess: ['Agra'], projectsHandledIds: mockProjects.filter(p => p.city === 'Agra').map(p => p.id), branchProject: 'Agra Operations', ticketsResolved: 10, ticketsPending: 2, businessEmail: 'dhinesh.kathiravan@lnt.co' },
  { psn: supervisorPSNs.payalRao, name: 'Payal Rao', title: 'Cluster Head (DH)', functionalRole: 'DH', role: 'DH', cityAccess: ['Maharashtra'], projectsHandledIds: mockProjects.filter(p => p.city === 'Maharashtra').map(p => p.id), branchProject: 'Maharashtra Operations', ticketsResolved: 12, ticketsPending: 1, businessEmail: 'payal.rao@lnt.co' },
  { psn: supervisorPSNs.rameshSubramanian, name: 'Ramesh Subramanian', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P001', projectsHandledIds: ['P001', 'P002', 'P003'], ticketsResolved: 5, ticketsPending: 1, businessEmail: 'ramesh.subramanian@lnt.co' },
  { psn: supervisorPSNs.arvindGupta, name: 'Arvind Gupta', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P004', projectsHandledIds: ['P004', 'P005', 'P006'], ticketsResolved: 3, ticketsPending: 0, businessEmail: 'arvind.gupta@lnt.co' },
  { psn: supervisorPSNs.sunilDesai, name: 'Sunil Desai', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P007', projectsHandledIds: ['P007','P008','P009','P010','P011','P012'], ticketsResolved: 4, ticketsPending: 1, businessEmail: 'sunil.desai@lnt.co' },
  { psn: supervisorPSNs.kavitaSen, name: 'Kavita Sen', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P013', projectsHandledIds: ['P013','P014'], ticketsResolved: 2, ticketsPending: 1, businessEmail: 'kavita.sen@lnt.co' },
  { psn: supervisorPSNs.vikasSharma, name: 'Vikas Sharma', title: 'Site Incharge (IS)', functionalRole: 'IS', role: 'IS', branchProject: 'P015', projectsHandledIds: ['P015','P016'], ticketsResolved: 3, ticketsPending: 0, businessEmail: 'vikas.sharma@lnt.co' },
];

export const mockSupervisors: Supervisor[] = baseSupervisors.map((supervisor, index) => ({
    ...supervisor,
    dateOfBirth: formattedDOBs[index] || "1980-01-01", // Fallback DOB
}));

// --- EMPLOYEES ---
const baseEmployees: Omit<Employee, 'dateOfBirth' | 'isName' | 'nsName' | 'dhName'>[] = [
  { psn: employeePSNs.nagarajanS, name: 'Nagarajan S', role: 'Employee', grade: 'M1-A', jobCodeId: 'JC003', project: 'P001', businessEmail: 'nagarajan.s@lnt.co', isPSN: supervisorPSNs.rameshSubramanian, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman },
  { psn: employeePSNs.priyaRavi, name: 'Priya Ravichandran', role: 'Employee', grade: 'M2-A', jobCodeId: 'JC004', project: 'P002', businessEmail: 'priya.ravi@lnt.co', isPSN: supervisorPSNs.rameshSubramanian, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman },
  { psn: employeePSNs.sureshK, name: 'Suresh K', role: 'Employee', grade: 'GET', jobCodeId: 'JC002', project: 'P003', businessEmail: 'suresh.k@lnt.co', isPSN: supervisorPSNs.rameshSubramanian, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman },
  { psn: employeePSNs.mohanLal, name: 'Mohan Lal', role: 'Employee', grade: 'S1', jobCodeId: 'JC005', project: 'P004', businessEmail: 'mohan.lal@lnt.co', isPSN: supervisorPSNs.arvindGupta, nsPSN: supervisorPSNs.dhineshKathiravan, dhPSN: supervisorPSNs.dhineshKathiravan },
  { psn: employeePSNs.deepakPatil, name: 'Deepak Patil', role: 'Employee', grade: 'M1-B', jobCodeId: 'JC003', project: 'P007', businessEmail: 'deepak.patil@lnt.co', isPSN: supervisorPSNs.sunilDesai, nsPSN: supervisorPSNs.payalRao, dhPSN: supervisorPSNs.payalRao },
  { psn: employeePSNs.anitaDas, name: 'Anita Das', role: 'Employee', grade: 'TC2', jobCodeId: 'JC006', project: 'P013', businessEmail: 'anita.das@lnt.co', isPSN: supervisorPSNs.kavitaSen, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman },
  { psn: employeePSNs.rajivKumar, name: 'Rajiv Kumar', role: 'Employee', grade: 'O1', jobCodeId: 'JC007', project: 'P015', businessEmail: 'rajiv.kumar@lnt.co', isPSN: supervisorPSNs.vikasSharma, nsPSN: supervisorPSNs.ganapathyRaman, dhPSN: supervisorPSNs.ganapathyRaman },
];

const tempMockEmployees: Employee[] = [];
let newEmployeePsnCounter = 10001000; // Starting PSN for newly generated employees

// Populate existing employees with DOBs
baseEmployees.forEach((emp, index) => {
    tempMockEmployees.push({
        ...emp,
        dateOfBirth: formattedDOBs[mockSupervisors.length + index] || "1990-01-01", // Fallback
    } as Employee); // Cast needed as isName etc. are not yet populated
});

// Add new employees for the remaining DOBs
const remainingDOBsForNewEmployees = formattedDOBs.slice(mockSupervisors.length + baseEmployees.length);

remainingDOBsForNewEmployees.forEach((dob, index) => {
    const psn = newEmployeePsnCounter++;
    const supervisorIndex = index % mockSupervisors.length;
    const dhSupervisors = mockSupervisors.filter(s => s.functionalRole === 'DH');
    const nsSupervisors = mockSupervisors.filter(s => s.functionalRole === 'NS' || s.functionalRole === 'DH' || s.functionalRole === 'IC Head');
    
    let assignedIS = mockSupervisors[supervisorIndex % mockSupervisors.length];
    // Try to assign IS from the same city if project matches
    const employeeProject = mockProjects[index % mockProjects.length];
    const cityIS = mockSupervisors.find(s => s.functionalRole === 'IS' && s.branchProject && mockProjects.find(p => p.id === s.branchProject)?.city === employeeProject.city);
    if (cityIS) assignedIS = cityIS;

    let assignedNS = employeeProject && dhSupervisors.find(dh => dh.cityAccess?.includes(employeeProject.city)) || nsSupervisors[index % nsSupervisors.length] || mockSupervisors[1];
    let assignedDH = employeeProject && dhSupervisors.find(dh => dh.cityAccess?.includes(employeeProject.city)) || dhSupervisors[index % dhSupervisors.length] || mockSupervisors[1];


    tempMockEmployees.push({
        psn: psn,
        name: `New Employee ${psn}`,
        role: 'Employee',
        grade: mockGrades[index % mockGrades.length],
        jobCodeId: mockJobCodes[index % mockJobCodes.length].id,
        project: employeeProject.id,
        businessEmail: `employee.${psn}@lnt.co`,
        dateOfBirth: dob || "1995-01-01", // Fallback
        isPSN: assignedIS.psn,
        nsPSN: assignedNS.psn,
        dhPSN: assignedDH.psn,
    } as Employee);
});


export const mockEmployees: Employee[] = tempMockEmployees.map(emp => {
    const is = mockSupervisors.find(s => s.psn === emp.isPSN);
    const ns = mockSupervisors.find(s => s.psn === emp.nsPSN);
    const dh = mockSupervisors.find(s => s.psn === emp.dhPSN);
    return {
        ...emp,
        isName: is?.name,
        nsName: ns?.name,
        dhName: dh?.name,
    };
});


// --- TICKETS ---
let ticketCounter = 1;
const generateTicketIdForMock = (): string => { 
  const paddedCounter = ticketCounter.toString().padStart(7, '0');
  ticketCounter++;
  return `#TK${paddedCounter}`;
};

const tempMockTickets: Ticket[] = [];
if (mockEmployees.length > 0) {
    const ticketsToGenerate = Math.min(mockEmployees.length * 2, 50); // Generate up to 50 tickets or 2 per employee
    for (let i = 0; i < ticketsToGenerate; i++) {
        const employee = mockEmployees[i % mockEmployees.length];
        const project = mockProjects.find(p => p.id === employee.project) || mockProjects[0];
        const statusOptions: TicketStatus[] = ['Open', 'In Progress', 'Pending', 'Resolved', 'Escalated to NS', 'Escalated to DH', 'Escalated to IC Head'];
        const priorityOptions: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
        const dateOffset = Math.floor(Math.random() * 30); // Days ago
        const queryDate = new Date(Date.now() - dateOffset * 24 * 60 * 60 * 1000).toISOString();
        
        const statusIndex = i % statusOptions.length;
        const currentStatus = statusOptions[statusIndex];
        
        let currentAssigneePSN = employee.isPSN;
        if (currentStatus === 'Escalated to NS' && employee.nsPSN) currentAssigneePSN = employee.nsPSN;
        else if (currentStatus === 'Escalated to DH' && employee.dhPSN) currentAssigneePSN = employee.dhPSN;
        else if (currentStatus === 'Escalated to IC Head') currentAssigneePSN = supervisorPSNs.umaSrinivasan;
        else if (currentStatus === 'Open' || currentStatus === 'Pending' || currentStatus === 'In Progress' || currentStatus === 'Resolved' || currentStatus === 'Closed') {
             currentAssigneePSN = employee.isPSN; // Default to IS for these common states
        }


        tempMockTickets.push({
            id: generateTicketIdForMock(),
            psn: employee.psn,
            employeeName: employee.name,
            query: `Issue regarding ${project.name} - Task ${i + 1}. Requires attention for item X.`,
            priority: priorityOptions[i % priorityOptions.length],
            dateOfQuery: queryDate,
            status: currentStatus,
            currentAssigneePSN: currentAssigneePSN,
            project: employee.project,
            lastStatusUpdateDate: queryDate,
            actionPerformed: currentStatus !== 'Open' ? `Action taken by supervisor for status ${currentStatus}.` : undefined,
            dateOfResponse: currentStatus !== 'Open' ? new Date(new Date(queryDate).getTime() + (Math.floor(Math.random() * 3) + 1) * 24 * 60 * 60 * 1000).toISOString() : undefined,
        });
    }
}
export const mockTickets: Ticket[] = tempMockTickets;

export const allMockUsers: User[] = [...mockEmployees, ...mockSupervisors];

    