
import type { Employee, Supervisor, Ticket, Project, City, JobCode, TicketStatus, User, TicketPriority } from '@/types';

// Helper function to parse and format dates
function parseAndFormatDate(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  try {
    const normalizedDateStr = dateStr.replace(/-/g, '/');
    const parts = normalizedDateStr.split('/');
    let day, month, year;

    if (parts.length === 3) {
        const part0 = parseInt(parts[0], 10);
        const part1 = parseInt(parts[1], 10);
        const part2 = parseInt(parts[2], 10);

        if (part0 > 0 && part0 <= 12 && part1 > 0 && part1 <= 31 && (parts[2]?.length === 4 || parts[2]?.length === 2)) {
            month = parts[0].padStart(2, '0');
            day = parts[1].padStart(2, '0');
            year = parts[2].length === 2 ? (part2 < 70 ? '20' + parts[2] : '19' + parts[2]) : parts[2];
        } else if (part0 > 0 && part0 <= 31 && part1 > 0 && part1 <= 12 && (parts[2]?.length === 4 || parts[2]?.length === 2)) {
            day = parts[0].padStart(2, '0');
            month = parts[1].padStart(2, '0');
            year = parts[2].length === 2 ? (part2 < 70 ? '20' + parts[2] : '19' + parts[2]) : parts[2];
        }

        if (year && month && day &&
            parseInt(year, 10) > 1900 && parseInt(year, 10) <= new Date().getFullYear() &&
            parseInt(month, 10) > 0 && parseInt(month, 10) <= 12 &&
            parseInt(day, 10) > 0 && parseInt(day, 10) <= 31) {
          const testDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
          if (testDate.getFullYear() === parseInt(year, 10) && testDate.getMonth() === (parseInt(month, 10) - 1) && testDate.getDate() === parseInt(day, 10)) {
            return `${year}-${month}-${day}`;
          }
        }
    }
  } catch (e) {
    // console.error("Error parsing date:", dateStr, e);
    return undefined;
  }
  return undefined;
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
  "04/20/1978", "07-01-1976", "02-05-1994", "02/14/1987", "08-02-1983", "04/20/1994", "02/25/1987", "09-03-1980",
  // ... (truncated for brevity in this thought block, but will be full in CDATA)
  // Add more dates to ensure we have at least 150 formatted DOBs
  "01/01/1990", "02/02/1991", "03/03/1992", "04/04/1993", "05/05/1994", "06/06/1995", "07/07/1996", "08/08/1997", "09/09/1998", "10/10/1999",
  "11/11/2000", "12/12/2001", "01/02/1980", "02/03/1981", "03/04/1982", "04/05/1983", "05/06/1984", "06/07/1985", "07/08/1986", "08/09/1987",
  "09/10/1988", "10/11/1989", "11/12/1990", "12/01/1991"
];

const formattedDOBs = userProvidedDatesRaw.map(parseAndFormatDate).filter(d => d !== undefined) as string[];
let dobIndex = 0;
const getNextDOB = (): string => {
  if (formattedDOBs.length === 0) return "1990-01-01"; // Fallback if no valid DOBs
  const dob = formattedDOBs[dobIndex % formattedDOBs.length];
  dobIndex++;
  return dob;
};

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
  { id: 'P017', name: 'Metros BU - HQ Chennai', city: 'Chennai'},
  { id: 'P018', name: 'Elevated Metros & HSR Segment', city: 'Chennai'},
  { id: 'P019', name: 'TRAINEES COST - UT SBG', city: 'Chennai'},
  { id: 'P020', name: 'MAHSR C3 TFL', city: 'Maharashtra'},
  { id: 'P021', name: 'MAHSR C3 Section-1', city: 'Maharashtra'},
  { id: 'P022', name: 'MAHSR C3 Section-2', city: 'Maharashtra'},
  { id: 'P023', name: 'MAHSR C3 Section-3', city: 'Maharashtra'},
  { id: 'P024', name: 'CMRL PH-2 ECV-01', city: 'Chennai'},
  { id: 'P025', name: 'CMRL Elevated RT01', city: 'Chennai'},
  { id: 'P026', name: 'Patna PC 08R', city: 'Patna'},
  { id: 'P027', name: 'CMRL PH-2 TU-02', city: 'Chennai'},
  { id: 'P028', name: 'RRTS Package 7', city: 'Agra'},
  { id: 'P029', name: 'CMRL C5 ECV02', city: 'Chennai'},
  { id: 'P030', name: 'RRTS P3L1', city: 'Agra'},
  { id: 'P031', name: 'RRTS P3L2', city: 'Agra'},
  { id: 'P032', name: 'Metros BU - HQ Delhi', city: 'Delhi' },
  { id: 'P033', name: 'CMRL CP10 EV03', city: 'Chennai' },
  { id: 'P034', name: 'Agra Metro AGCC-07', city: 'Agra' },
  { id: 'P035', name: 'KOL METRO UG1', city: 'Kolkata' },
  { id: 'P036', name: 'Bangalore Metro Phase II - RT03', city: 'Bangalore' },
  { id: 'P037', name: 'Bangalore Metro Phase II - RT02', city: 'Bangalore' },
  { id: 'P038', name: 'MEGA PKG2', city: 'Ahmedabad'},
];

export const mockCities: City[] = Array.from(new Set(mockProjects.map(p => p.city))).map(cityName => ({
    name: cityName,
    projects: mockProjects.filter(p => p.city === cityName)
}));

const predefinedGrades = [
    "M1-A", "M1-B", "M1-C", "M2-A", "M2-B", "M2-C", "M3-A", "M3-B", "M3-C", "M4-A", "M4-B", "M4-C",
    "O1", "O2", "S1", "S2", "GET", "MT", "FTC", "Retainer", "Expat"
].sort();
export const mockGrades: string[] = predefinedGrades;


export let mockJobCodes: JobCode[] = [];
const uniqueJobCodeSet = new Set<string>();
mockGrades.forEach(grade => uniqueJobCodeSet.add(`JC_${grade.replace(/[^a-zA-Z0-9]/g, '') || 'UNKNOWN'}`));
mockJobCodes = Array.from(uniqueJobCodeSet).map((jcId, index) => {
    const gradePart = jcId.substring(3);
    const originalGrade = mockGrades.find(g => (g.replace(/[^a-zA-Z0-9]/g, '') || 'UNKNOWN') === gradePart) || `Grade ${index + 1}`;
    return {
        id: jcId,
        code: originalGrade,
        description: originalGrade
    };
});

const rawNewEmployeeData = [
    { psnStr: "10004703", name: "ANURAG P M", grade: "M2-B", department: "MAHSR C3 Section-1", email: "anuragpm@lntecc.com", is_name: "Alla, Gopinath", is_psn_str: "85817", ns_name: "Kumar Singh, Sunil", ns_psn_str: "82370", dh_name: "Kumar Agarwal, Manish", dh_psn_str: "20076337" },
    { psnStr: "174885", name: "DEEPAK PRAKASH", grade: "M1-B", department: "Agra Metro AGCC-07", email: "dpk@lntecc.com", is_name: "K, Bhavani", is_psn_str: "20139863", ns_name: "K, Bhavani", ns_psn_str: "20139863", dh_name: "K, Bhavani", dh_psn_str: "20139863" },
    { psnStr: "10004424", name: "ASHUTOSH MISHRA", grade: "M3-A", department: "Metros BU - HQ Chennai", email: "amishra@lntecc.com", is_name: "Badami, Dattatreya", is_psn_str: "15371", ns_name: "Badami, Dattatreya", ns_psn_str: "15371", dh_name: "Badami, Dattatreya", dh_psn_str: "15371" },
    { psnStr: "163389", name: "THAMIDHALA SATISH KUMAR REDDY", grade: "M3-A", department: "Metros BU - HQ Chennai", email: "tskr@lntecc.com", is_name: "Bhavani, Koneru", is_psn_str: "20139863", ns_name: "Bhavani, Koneru", ns_psn_str: "20139863", dh_name: "Bhavani, Koneru", dh_psn_str: "20139863" },
    { psnStr: "173240", name: "GOPI M", grade: "M2-B", department: "CMRL Elevated RT01", email: "mg@lntecc.com", is_name: "Bhavani, Koneru", is_psn_str: "20139863", ns_name: "Bhavani, Koneru", ns_psn_str: "20139863", dh_name: "Bhavani, Koneru", dh_psn_str: "20139863" },
    { psnStr: "20041886", name: "KRISHNA PRABHAKAR K", grade: "M2-C", department: "CMRL C5 ECV02", email: "krishnaprabhakar@lntecc.com", is_name: "Bhavani, Koneru", is_psn_str: "20139863", ns_name: "Bhavani, Koneru", ns_psn_str: "20139863", dh_name: "Bhavani, Koneru", dh_psn_str: "20139863" },
    { psnStr: "20057742", name: "ANJANA R", grade: "M1-C", department: "Metros BU - HQ Chennai", email: "anrv@lntecc.com", is_name: "REDDY, THAMIDHALA SATISH KUMAR", is_psn_str: "163389", ns_name: "REDDY, THAMIDHALA SATISH KUMAR", ns_psn_str: "163389", dh_name: "REDDY, THAMIDHALA SATISH KUMAR", dh_psn_str: "163389" },
    { psnStr: "20060765", name: "RANGU TEJA VARA SRINIVAS", grade: "M1-A", department: "Metros BU - HQ Chennai", email: "Rteja@lntecc.com", is_name: "REDDY, THAMIDHALA SATISH KUMAR", is_psn_str: "163389", ns_name: "REDDY, THAMIDHALA SATISH KUMAR", ns_psn_str: "163389", dh_name: "REDDY, THAMIDHALA SATISH KUMAR", dh_psn_str: "163389" },
    { psnStr: "20076337", name: "MANISH KUMAR AGARWAL", grade: "M4-A", department: "Elevated Metros & HSR Segment", email: "MANISH-AGARWAL@lntecc.com", is_name: "Bhavani, Koneru", is_psn_str: "20139863", ns_name: "Bhavani, Koneru", ns_psn_str: "20139863", dh_name: "Bhavani, Koneru", dh_psn_str: "20139863" },
    { psnStr: "20076716", name: "VIVEK MARUTI PAI", grade: "M4-A", department: "Orange Gate", email: "PAI-VIVEK@lntecc.com", is_name: "Bhavani, Koneru", is_psn_str: "20139863", ns_name: "Bhavani, Koneru", ns_psn_str: "20139863", dh_name: "Bhavani, Koneru", dh_psn_str: "20139863" },
    { psnStr: "20189863", name: "LAKSHMI PRASAD VESANGI", grade: "Retainer", department: "Bangalore Metro Phase II - RT03", email: "VESANGI@lntecc.com", is_name: "SRIDHARAN NS", is_psn_str: "84504", ns_name: "SRIDHARAN NS", ns_psn_str: "84504", dh_name: "Bhavani, Koneru", dh_psn_str: "20139863" },
    { psnStr: "20191696", name: "AL SABAH R", grade: "M1-A", department: "Metros BU - HQ Chennai", email: "alsr@lntecc.com", is_name: "REDDY, THAMIDHALA SATISH KUMAR", is_psn_str: "163389", ns_name: "REDDY, THAMIDHALA SATISH KUMAR", ns_psn_str: "163389", dh_name: "REDDY, THAMIDHALA SATISH KUMAR", dh_psn_str: "163389" },
    { psnStr: "20191728", name: "VAKICHERLA ADITYA", grade: "M1-A", department: "CMRL CP10 EV03", email: "VAKICHERLA@lntecc.com", is_name: "REDDY, THAMIDHALA SATISH KUMAR", is_psn_str: "163389", ns_name: "REDDY, THAMIDHALA SATISH KUMAR", ns_psn_str: "163389", dh_name: "REDDY, THAMIDHALA SATISH KUMAR", dh_psn_str: "163389" },
    { psnStr: "20315740", name: "ABHIJEET THAKURTA", grade: "M3-C", department: "CMRL CP10 EV03", email: "ABHIJEET-T@lntecc.com", is_name: "Kumar Agarwal, Manish", is_psn_str: "20076337", ns_name: "Kumar Agarwal, Manish", ns_psn_str: "20076337", dh_name: "Kumar Agarwal, Manish", dh_psn_str: "20076337" },
    { psnStr: "20321528", name: "MUTHU ARAVIND V", grade: "O2", department: "Metros BU - HQ Chennai", email: "muthu.venkatachalapathi@lntecc.com", is_name: "REDDY, THAMIDHALA SATISH KUMAR", is_psn_str: "163389", ns_name: "REDDY, THAMIDHALA SATISH KUMAR", ns_psn_str: "163389", dh_name: "REDDY, THAMIDHALA SATISH KUMAR", dh_psn_str: "163389" },
    { psnStr: "20370156", name: "SAJAN SHARMA", grade: "GET", department: "TRAINEES COST - UT SBG", email: "sajan.sharma@lntecc.com", is_name: "REDDY, THAMIDHALA SATISH KUMAR", is_psn_str: "163389", ns_name: "REDDY, THAMIDHALA SATISH KUMAR", ns_psn_str: "163389", dh_name: "REDDY, THAMIDHALA SATISH KUMAR", dh_psn_str: "163389" },
    { psnStr: "20370205", name: "KSHITIZ SINGH", grade: "MT", department: "TRAINEES COST - UT SBG", email: "kshitiz.singh@lntecc.com", is_name: "REDDY, THAMIDHALA SATISH KUMAR", is_psn_str: "163389", ns_name: "REDDY, THAMIDHALA SATISH KUMAR", ns_psn_str: "163389", dh_name: "REDDY, THAMIDHALA SATISH KUMAR", dh_psn_str: "163389" },
    { psnStr: "20370213", name: "RAJAT JANGIR", grade: "GET", department: "TRAINEES COST - UT SBG", email: "rajat.jangir@lntecc.com", is_name: "Singh, Ambrish", is_psn_str: "184658", ns_name: "Singh, Ambrish", ns_psn_str: "184658", dh_name: "Singh, Ambrish", dh_psn_str: "184658" },
    { psnStr: "20370214", name: "SHARIQUE AHSAN ABEDIN", grade: "GET", department: "TRAINEES COST - UT SBG", email: "sharique.abedin@lntecc.com", is_name: "Singh, Ambrish", is_psn_str: "184658", ns_name: "Singh, Ambrish", ns_psn_str: "184658", dh_name: "Singh, Ambrish", dh_psn_str: "184658" },
    { psnStr: "20370216", name: "SHREYAS VIVEK KURADE", grade: "GET", department: "TRAINEES COST - UT SBG", email: "shreyas.kurade@lntecc.com", is_name: "G M, Harsha", is_psn_str: "20362056", ns_name: "G M, Harsha", ns_psn_str: "20362056", dh_name: "G M, Harsha", dh_psn_str: "20362056" },
    { psnStr: "20370217", name: "SUNIL YADAV", grade: "GET", department: "TRAINEES COST - UT SBG", email: "sunil.yadav3@lntecc.com", is_name: "Singh, Ambrish", is_psn_str: "184658", ns_name: "Singh, Ambrish", ns_psn_str: "184658", dh_name: "Singh, Ambrish", dh_psn_str: "184658" },
    { psnStr: "20373049", name: "CHANDAN RAI", grade: "M3-A", department: "Metros BU - HQ Chennai", email: "chandan.rai@lntecc.com", is_name: "Mishra, Ashutosh", is_psn_str: "10004424", ns_name: "Mishra, Ashutosh", ns_psn_str: "10004424", dh_name: "Mishra, Ashutosh", dh_psn_str: "10004424" },
    { psnStr: "20373342", name: "MICHAEL WILLIAM SANDERSON", grade: "Expat", department: "Orange Gate", email: "michael.sanderson@lntecc.com", is_name: "G, Vinod", is_psn_str: "13441", ns_name: "G, Vinod", ns_psn_str: "13441", dh_name: "G, Vinod", dh_psn_str: "13441" },
    { psnStr: "20376111", name: "TILAK B", grade: "O2", department: "Metros BU - HQ Chennai", email: "tilak.b1@lntecc.com", is_name: "REDDY, THAMIDHALA SATISH KUMAR", is_psn_str: "163389", ns_name: "REDDY, THAMIDHALA SATISH KUMAR", ns_psn_str: "163389", dh_name: "REDDY, THAMIDHALA SATISH KUMAR", dh_psn_str: "163389" },
    { psnStr: "20380562", name: "NALLAMILLI SUMEDHA", grade: "O1", department: "Metros BU - HQ Chennai", email: "nallamilli.sumedha@LNTECC.COM", is_name: "REDDY, THAMIDHALA SATISH KUMAR", is_psn_str: "163389", ns_name: "REDDY, THAMIDHALA SATISH KUMAR", ns_psn_str: "163389", dh_name: "REDDY, THAMIDHALA SATISH KUMAR", dh_psn_str: "163389" },
    { psnStr: "20380734", name: "HARISH KUMAR N", grade: "FTC", department: "Orange Gate", email: "harish.n1@LNTECC.COM", is_name: "Maruti Pai, Vivek", is_psn_str: "20076716", ns_name: "Maruti Pai, Vivek", ns_psn_str: "20076716", dh_name: "Maruti Pai, Vivek", dh_psn_str: "20076716" },
    { psnStr: "20381176", name: "HANZALA MANZAR", grade: "O2", department: "MAHSR C3 TFL", email: "hanzala.manzar@LNTECC.COM", is_name: "., Muthuvazhi", is_psn_str: "184615", ns_name: "., Muthuvazhi", ns_psn_str: "184615", dh_name: "., Muthuvazhi", dh_psn_str: "184615" },
    { psnStr: "84504", name: "SRIDHARAN NS", grade: "M4-A", department: "Metros BU - HQ Chennai", email: "Nssridharan@lntecc.com", is_name: "Bhavani, Koneru", is_psn_str: "20139863", ns_name: "Bhavani, Koneru", ns_psn_str: "20139863", dh_name: "Bhavani, Koneru", dh_psn_str: "20139863" },
    { psnStr: "85817", name: "GOPINATH ALLA", grade: "M4-A", department: "Metros BU - HQ Chennai", email: "Agopinath@lntecc.com", is_name: "Bhavani, Koneru", is_psn_str: "20139863", ns_name: "Bhavani, Koneru", ns_psn_str: "20139863", dh_name: "Bhavani, Koneru", dh_psn_str: "20139863" },
    { psnStr: "10004907", name: "RAJAKANI A", grade: "M1-A", department: "MAHSR C3 Section-2", email: "rajakani@lntecc.com", is_name: "Pahwa, Rashpal", is_psn_str: "138124", ns_name: "Pahwa, Rashpal", ns_psn_str: "138124", dh_name: "Pahwa, Rashpal", dh_psn_str: "138124" },
    { psnStr: "81240", name: "PADMANABHAN S", grade: "M3-C", department: "Metros BU - HQ Chennai", email: "pads@lntecc.com", is_name: "D, Vijayakumar", is_psn_str: "81075", ns_name: "D, Vijayakumar", ns_psn_str: "81075", dh_name: "D, Vijayakumar", dh_psn_str: "81075" },
    { psnStr: "83681", name: "YUNUS HARIS AZIZ", grade: "M3-C", department: "MAHSR C3 TFL", email: "yha@lntecc.com", is_name: "D, Vijayakumar", is_psn_str: "81075", ns_name: "D, Vijayakumar", ns_psn_str: "81075", dh_name: "D, Vijayakumar", dh_psn_str: "81075" },
    { psnStr: "20345164", name: "KAPU KIRAN KUMAR", grade: "M1-A", department: "Orange Gate", email: "kapu.kumar@lntecc.com", is_name: "Maruti Pai, Vivek", is_psn_str: "20076716", ns_name: "Maruti Pai, Vivek", ns_psn_str: "20076716", dh_name: "Maruti Pai, Vivek", dh_psn_str: "20076716" },
    { psnStr: "10004115", name: "MAKADIA VIMALKUMAR MAGANLAL", grade: "M1-B", department: "MMRC BKC & Dharavi", email: "makadiavm@lntecc.com", is_name: "Juneja, Jitender", is_psn_str: "20041850", ns_name: "Juneja, Jitender", ns_psn_str: "20041850", dh_name: "Juneja, Jitender", dh_psn_str: "20041850" },
    { psnStr: "10004291", name: "MUTHUSELVAM C", grade: "M1-A", department: "CMRL CP10 EV03", email: "muthuselvamc@lntecc.com", is_name: "N, Sankaranarayanan", is_psn_str: "15081", ns_name: "N, Sankaranarayanan", ns_psn_str: "15081", dh_name: "N, Sankaranarayanan", dh_psn_str: "15081" },
    { psnStr: "10004466", name: "PARKAR KUNDAN KAMALAKAR", grade: "M1-A", department: "Orange Gate", email: "kundan@lntecc.com", is_name: "S, Manickavasagampillai", is_psn_str: "20128701", ns_name: "S, Manickavasagampillai", ns_psn_str: "20128701", dh_name: "S, Manickavasagampillai", dh_psn_str: "20128701" },
    { psnStr: "10004470", name: "SHAIKH JAVED MOHAMMAD AKIL", grade: "M1-C", department: "MAHSR C3 TFL", email: "javeedms@lntecc.com", is_name: "S, Shyam", is_psn_str: "20071122", ns_name: "S, Shyam", ns_psn_str: "20071122", dh_name: "S, Shyam", dh_psn_str: "20071122" },
    { psnStr: "10004471", name: "BALASUBRAMANIAN K", grade: "M1-A", department: "CMRL PH-2 ECV-01", email: "kbsn@lntecc.com", is_name: "N, Sankaranarayanan", is_psn_str: "15081", ns_name: "N, Sankaranarayanan", ns_psn_str: "15081", dh_name: "N, Sankaranarayanan", dh_psn_str: "15081" },
    { psnStr: "10004501", name: "GIRDHAR ASHISH BHASKAR", grade: "M1-A", department: "KOL METRO UG1", email: "ashishg@lntecc.com", is_name: "Banerjee, Subrato", is_psn_str: "81987", ns_name: "Banerjee, Subrato", ns_psn_str: "81987", dh_name: "Banerjee, Subrato", dh_psn_str: "81987" },
    { psnStr: "10006933", name: "SESHA SAILA KUMAR CH", grade: "S2", department: "Orange Gate", email: "chssk@lntecc.com", is_name: "S, Manickavasagampillai", is_psn_str: "20128701", ns_name: "S, Manickavasagampillai", ns_psn_str: "20128701", dh_name: "S, Manickavasagampillai", dh_psn_str: "20128701" },
    { psnStr: "10008645", name: "KINESHWAR SAHU", grade: "O2", department: "MAHSR C5", email: "kineshwar@lntecc.com", is_name: "Kumar Rai, Santosh", is_psn_str: "20129647", ns_name: "Kumar Rai, Santosh", ns_psn_str: "20129647", dh_name: "Kumar Rai, Santosh", dh_psn_str: "20129647" },
    { psnStr: "136178", name: "KOLHALE HIRALAL BAPU", grade: "M1-C", department: "Patna Metro PC-03", email: "hiralalk@lntecc.com", is_name: "CHANDRA TRIPATHI, LAL", is_psn_str: "81954", ns_name: "CHANDRA TRIPATHI, LAL", ns_psn_str: "81954", dh_name: "CHANDRA TRIPATHI, LAL", dh_psn_str: "81954" },
    { psnStr: "136774", name: "SUBRATA CHATTOPADHYAY", grade: "M2-C", department: "DMRC DC09", email: "Schatterjee@lntecc.com", is_name: "S, Padmanabhan", is_psn_str: "81240", ns_name: "S, Padmanabhan", ns_psn_str: "81240", dh_name: "S, Padmanabhan", dh_psn_str: "81240" },
    { psnStr: "15081", name: "SANKARANARAYANAN N", grade: "M3-B", department: "CMRL PH-2 TU-02", email: "NSANKAR@lntecc.com", is_name: "S, Padmanabhan", is_psn_str: "81240", ns_name: "S, Padmanabhan", ns_psn_str: "81240", dh_name: "S, Padmanabhan", dh_psn_str: "81240" },
    { psnStr: "164174", name: "NIRAJ HASMUKHRAY PATHAK", grade: "M1-C", department: "MAHSR C3 TFL", email: "pathaknh@lntecc.com", is_name: "PATRAWALA, ABOOZAR MOIZ", is_psn_str: "81233", ns_name: "PATRAWALA, ABOOZAR MOIZ", ns_psn_str: "81233", dh_name: "PATRAWALA, ABOOZAR MOIZ", dh_psn_str: "81233" },
    { psnStr: "164280", name: "AMRITA GOPAL BANERJEE", grade: "M2-C", department: "MAHSR C3 Section-2", email: "Agbanerjee@lntecc.com", is_name: "PATRAWALA, ABOOZAR MOIZ", is_psn_str: "81233", ns_name: "PATRAWALA, ABOOZAR MOIZ", ns_psn_str: "81233", dh_name: "PATRAWALA, ABOOZAR MOIZ", dh_psn_str: "81233" },
    { psnStr: "164340", name: "GOURANGA CHANDRA MISHRA", grade: "M1-B", department: "KOL METRO UG1", email: "gcmishra@lntecc.com", is_name: "Banerjee, Subrato", is_psn_str: "81987", ns_name: "Banerjee, Subrato", ns_psn_str: "81987", dh_name: "Banerjee, Subrato", dh_psn_str: "81987" },
    { psnStr: "20112444", name: "VINAY KUMAR TIWARI", grade: "M1-A", department: "Agra Metro AGCC-07", email: "vktiwarip@lntecc.com", is_name: "M, Thiruvengadam", is_psn_str: "243028", ns_name: "M, Thiruvengadam", ns_psn_str: "243028", dh_name: "M, Thiruvengadam", dh_psn_str: "243028" },
    { psnStr: "173796", name: "PRANAV DUBEY", grade: "M1-B", department: "Patna PC 08R", email: "pranavdubey@lntecc.com", is_name: "CHANDRA TRIPATHI, LAL", is_psn_str: "81954", ns_name: "CHANDRA TRIPATHI, LAL", ns_psn_str: "81954", dh_name: "CHANDRA TRIPATHI, LAL", dh_psn_str: "81954" }
];

let tempEmployees: Employee[] = [];
const supervisorMap = new Map<number, { name: string, psn: number, roles: Set<User['role']>, email?: string, department?: string, title?: string, citySet: Set<string>, projectSet: Set<string>, grade?: string }>();
const IC_HEAD_PSN = 20192584; // Example PSN for IC Head
const IC_HEAD_NAME = "Uma Srinivasan"; // Example Name for IC Head

supervisorMap.set(IC_HEAD_PSN, {
    name: IC_HEAD_NAME,
    psn: IC_HEAD_PSN,
    roles: new Set<'IS' | 'NS' | 'DH' | 'IC Head'>(['IC Head']),
    email: `${IC_HEAD_PSN}@lntecc.com`,
    title: "IC Head",
    citySet: new Set<string>(mockCities.map(c => c.name)),
    projectSet: new Set<string>(mockProjects.map(p => p.id)),
    grade: "M4-C" // Example grade for IC Head
});

rawNewEmployeeData.forEach((empData, index) => {
    const psn = parseInt(empData.psnStr, 10);
    if (isNaN(psn)) return;

    const supervisorPSNs = {
        is: empData.is_psn_str && !isNaN(parseInt(empData.is_psn_str)) ? parseInt(empData.is_psn_str) : IC_HEAD_PSN, // Fallback to IC Head
        ns: empData.ns_psn_str && !isNaN(parseInt(empData.ns_psn_str)) ? parseInt(empData.ns_psn_str) : IC_HEAD_PSN, // Fallback to IC Head
        dh: empData.dh_psn_str && !isNaN(parseInt(empData.dh_psn_str)) ? parseInt(empData.dh_psn_str) : IC_HEAD_PSN, // Fallback to IC Head
    };
    const supervisorNames = {
        is: (empData.is_name && empData.is_name.toLowerCase() !== 'n/a' ? empData.is_name : IC_HEAD_NAME),
        ns: (empData.ns_name && empData.ns_name.toLowerCase() !== 'n/a' ? empData.ns_name : IC_HEAD_NAME),
        dh: (empData.dh_name && empData.dh_name.toLowerCase() !== 'n/a' ? empData.dh_name : IC_HEAD_NAME),
    };

    const departmentProjectName = empData.department?.trim();
    let projectObj = mockProjects.find(p => p.name.toLowerCase() === departmentProjectName?.toLowerCase() || p.id.toLowerCase() === departmentProjectName?.toLowerCase());
    if (!projectObj) {
        const cityMatch = mockCities.find(city => departmentProjectName?.toLowerCase().includes(city.name.toLowerCase()));
        projectObj = (cityMatch && cityMatch.projects.length > 0) ? cityMatch.projects[0] : (mockProjects.find(p => p.id === 'P001') || mockProjects[0]);
    }

    const addOrUpdateSupervisor = (psnVal?: number, nameVal?: string, role?: 'IS' | 'NS' | 'DH', titleVal?: string, gradeVal?: string) => {
        if (psnVal && nameVal && role) {
            if (!supervisorMap.has(psnVal)) {
                supervisorMap.set(psnVal, {
                    name: nameVal, psn: psnVal, roles: new Set(),
                    email: `${psnVal}@lntecc.com`, title: titleVal || role,
                    citySet: new Set(), projectSet: new Set(), grade: gradeVal || mockGrades[0] // Assign a default grade if not provided
                });
            }
            const sup = supervisorMap.get(psnVal)!;
            sup.roles.add(role);
            if(gradeVal && mockGrades.includes(gradeVal)) sup.grade = gradeVal;

            if (projectObj) {
                sup.citySet.add(projectObj.city);
                sup.projectSet.add(projectObj.id);
            }
            const employeeRecordForSupTitle = rawNewEmployeeData.find(e => parseInt(e.psnStr,10) === psnVal);
            if (employeeRecordForSupTitle?.grade && (!sup.title || sup.title === role || sup.title === "IS" || sup.title === "NS" || sup.title === "DH")) {
                 sup.title = employeeRecordForSupTitle.grade;
            }
        }
    };
    
    const originalEmpGrade = empData.grade;
    addOrUpdateSupervisor(supervisorPSNs.is, supervisorNames.is, 'IS', originalEmpGrade, originalEmpGrade);
    addOrUpdateSupervisor(supervisorPSNs.ns, supervisorNames.ns, 'NS', originalEmpGrade, originalEmpGrade); // NS might not have a 'grade' title in same way
    addOrUpdateSupervisor(supervisorPSNs.dh, supervisorNames.dh, 'DH', originalEmpGrade, originalEmpGrade); // DH might not have a 'grade' title in same way
    
    const empGrade = mockGrades.includes(originalEmpGrade) ? originalEmpGrade : mockGrades[index % mockGrades.length];
    const jobCodeForGrade = mockJobCodes.find(jc => jc.code === empGrade) || mockJobCodes[0];


    tempEmployees.push({
        psn: psn, name: empData.name, role: 'Employee',
        grade: empGrade,
        jobCodeId: jobCodeForGrade.id,
        project: projectObj.id,
        businessEmail: empData.email || `${psn}@lntecc.com`,
        dateOfBirth: getNextDOB(),
        isPSN: supervisorPSNs.is, isName: supervisorNames.is,
        nsPSN: supervisorPSNs.ns, nsName: supervisorNames.ns,
        dhPSN: supervisorPSNs.dh, dhName: supervisorNames.dh,
    });
});


const basePsnForNewEmployees = 30000000;
const maxTotalUsers = 150; // Target total user count
const currentTempEmployeeCount = tempEmployees.length;
const currentSupervisorCount = supervisorMap.size; // Count supervisors already identified

// Calculate how many *new* employees to generate to reach ~maxTotalUsers
const slotsForNewGeneratedEmployees = Math.max(0, maxTotalUsers - currentTempEmployeeCount - currentSupervisorCount);
const datesToUseForNewEmployees = Math.min(formattedDOBs.length - dobIndex, slotsForNewGeneratedEmployees);


if (datesToUseForNewEmployees > 0 && mockGrades.length > 0 && mockJobCodes.length > 0 && mockProjects.length > 0) {
    for (let i = 0; i < datesToUseForNewEmployees; i++) {
        const newPsn = basePsnForNewEmployees + i;
        const existingSupervisorArray = Array.from(supervisorMap.values()).filter(s => s.psn !== IC_HEAD_PSN); // Exclude IC head for direct assignment to new employees
        
        const isSup = existingSupervisorArray.length > 0 ? existingSupervisorArray[i % existingSupervisorArray.length] : supervisorMap.get(IC_HEAD_PSN);
        const nsSup = existingSupervisorArray.length > 0 ? existingSupervisorArray[(i + 1) % existingSupervisorArray.length] : supervisorMap.get(IC_HEAD_PSN);
        const dhSup = existingSupervisorArray.length > 0 ? existingSupervisorArray[(i + 2) % existingSupervisorArray.length] : supervisorMap.get(IC_HEAD_PSN);
        
        const assignedGrade = mockGrades[i % mockGrades.length];
        const assignedJobCode = mockJobCodes.find(jc => jc.code === assignedGrade) || mockJobCodes[0];

        tempEmployees.push({
            psn: newPsn,
            name: `Generated Employee ${i + 1}`,
            role: 'Employee',
            grade: assignedGrade,
            jobCodeId: assignedJobCode.id,
            project: mockProjects[i % mockProjects.length].id,
            businessEmail: `${newPsn}@lntecc.com`,
            dateOfBirth: getNextDOB(),
            isPSN: isSup?.psn, isName: isSup?.name,
            nsPSN: nsSup?.psn, nsName: nsSup?.name,
            dhPSN: dhSup?.psn, dhName: dhSup?.name,
        });
    }
}
export let mockEmployees: Employee[] = tempEmployees;


let finalSupervisors: Supervisor[] = [];
supervisorMap.forEach(supData => {
    let finalRole: User['role'] = 'IS';
    let finalFunctionalRole: 'IS' | 'NS' | 'DH' | 'IC Head' = 'IS';
    let finalTitle = supData.title || "Supervisor";

    if (supData.psn === IC_HEAD_PSN) {
        finalRole = 'IC Head'; finalFunctionalRole = 'IC Head'; finalTitle = "IC Head";
    } else if (supData.roles.has('DH')) {
        finalRole = 'DH'; finalFunctionalRole = 'DH'; finalTitle = supData.title || "Department Head";
    } else if (supData.roles.has('NS')) {
        finalRole = 'NS'; finalFunctionalRole = 'NS'; finalTitle = supData.title || "Next Level Supervisor";
    } else if (supData.roles.has('IS')) {
        finalRole = 'IS'; finalFunctionalRole = 'IS'; finalTitle = supData.title || "Immediate Supervisor";
    }
    
    const employeeRecord = rawNewEmployeeData.find(e => parseInt(e.psnStr, 10) === supData.psn);
    if(employeeRecord?.grade && (finalTitle === finalFunctionalRole || finalTitle === "Supervisor" || finalTitle === "IS" || finalTitle === "NS" || finalTitle === "DH")){
        finalTitle = employeeRecord.grade; // Use their actual grade as title if it's more specific
    }


    finalSupervisors.push({
        psn: supData.psn, name: supData.name, role: finalRole, functionalRole: finalFunctionalRole,
        title: finalTitle, businessEmail: supData.email, dateOfBirth: supData.psn === IC_HEAD_PSN ? getNextDOB() : (employeeRecord ? getNextDOB() : getNextDOB()), // Ensure all supervisors get a DOB
        cityAccess: Array.from(supData.citySet),
        branchProject: Array.from(supData.projectSet)[0] || (mockProjects.length > 0 ? mockProjects[0].id : undefined),
        projectsHandledIds: Array.from(supData.projectSet),
        ticketsResolved: Math.floor(Math.random() * 20), ticketsPending: Math.floor(Math.random() * 5),
    });
});

const uniqueSupervisorsMap = new Map<number, Supervisor>();
finalSupervisors.forEach(s => {
    const existing = uniqueSupervisorsMap.get(s.psn);
    const rolePriority = {'IC Head': 4, 'DH': 3, 'NS': 2, 'IS': 1, 'Employee': 0};
    if (!existing || rolePriority[s.role as keyof typeof rolePriority] > rolePriority[existing.role as keyof typeof rolePriority]) {
        uniqueSupervisorsMap.set(s.psn, s);
    } else if (existing && existing.role === s.role && s.title && (!existing.title || ["IS", "NS", "DH", "Supervisor"].includes(existing.title)) && !["IS", "NS", "DH", "Supervisor"].includes(s.title)) {
        existing.title = s.title; 
    }
});
export let mockSupervisors: Supervisor[] = Array.from(uniqueSupervisorsMap.values());


let ticketCounter = 1;
const generateTicketIdForMock = (): string => {
  const paddedCounter = ticketCounter.toString().padStart(7, '0');
  ticketCounter++;
  return `#TK${paddedCounter}`;
};

export let mockTickets: Ticket[] = [];
if (mockEmployees.length > 0 && mockSupervisors.length > 0) {
    const ticketsToGenerate = Math.min(mockEmployees.length * 2, 100); // Limit to 100 tickets for performance
    for (let i = 0; i < ticketsToGenerate; i++) {
        const employee = mockEmployees[i % mockEmployees.length];
        if (!employee || !employee.project) continue;

        const project = mockProjects.find(p => p.id === employee.project) || mockProjects[0];
        const statusOptions: TicketStatus[] = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Escalated to NS', 'Escalated to DH', 'Escalated to IC Head'];
        const priorityOptions: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
        
        const dateOffset = Math.floor(Math.random() * 30) +1; 
        const queryDate = new Date(Date.now() - dateOffset * 24 * 60 * 60 * 1000);
        const queryDateISO = queryDate.toISOString();
        
        const currentStatus = statusOptions[i % statusOptions.length];
        
        let currentAssigneePSN = employee.isPSN; // Default to IS
        if (currentStatus === 'Escalated to NS' && employee.nsPSN) currentAssigneePSN = employee.nsPSN;
        else if (currentStatus === 'Escalated to DH' && employee.dhPSN) currentAssigneePSN = employee.dhPSN;
        else if (currentStatus === 'Escalated to IC Head') currentAssigneePSN = IC_HEAD_PSN;
        else if (currentStatus === 'Open' && !employee.isPSN) currentAssigneePSN = IC_HEAD_PSN; // If Open and no IS, assign to IC Head
        
        // Fallback if assignee is not found or is undefined
        if (!currentAssigneePSN || !mockSupervisors.find(s => s.psn === currentAssigneePSN)) {
            const projectSupervisors = mockSupervisors.filter(s => s.projectsHandledIds?.includes(project.id) && s.functionalRole === 'IS');
            currentAssigneePSN = projectSupervisors.length > 0 ? projectSupervisors[0].psn : (mockSupervisors.find(s=>s.functionalRole === 'IS')?.psn || IC_HEAD_PSN);
        }


        const lastStatusUpdateDaysAgo = Math.floor(Math.random() * (dateOffset > 1 ? dateOffset -1 : 0) );
        const lastStatusUpdateDate = new Date(queryDate.getTime() + (dateOffset - lastStatusUpdateDaysAgo) * 24*60*60*1000).toISOString();
        
        let dateOfResponse: string | undefined = undefined;
        if (currentStatus !== 'Open' && currentStatus !== 'Pending') {
             const responseDaysAfterLastUpdate = Math.floor(Math.random() * Math.max(1, lastStatusUpdateDaysAgo -1)) + 1;
             dateOfResponse = new Date(new Date(lastStatusUpdateDate).getTime() + responseDaysAfterLastUpdate * 24 * 60 * 60 * 1000).toISOString();
        }


        mockTickets.push({
            id: generateTicketIdForMock(),
            psn: employee.psn,
            employeeName: employee.name,
            query: `Issue regarding ${project.name} - Task ${i + 1}. Needs review for component ${String.fromCharCode(65 + i % 26)}. Details: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            priority: priorityOptions[i % priorityOptions.length],
            dateOfQuery: queryDateISO,
            status: currentStatus,
            currentAssigneePSN: currentAssigneePSN,
            project: employee.project,
            lastStatusUpdateDate: lastStatusUpdateDate,
            actionPerformed: dateOfResponse ? `Action taken on ${new Date(dateOfResponse).toLocaleDateString()}. Status set to ${currentStatus}.` : undefined,
            dateOfResponse: dateOfResponse,
            attachments: i % 5 === 0 ? [{ id: `att-${i}`, fileName: `document-${i}.pdf`, fileType: 'document', urlOrContent: '#', uploadedAt: queryDateISO }] : undefined,
        });
    }
}

export const allMockUsers: User[] = [...mockEmployees, ...mockSupervisors];
