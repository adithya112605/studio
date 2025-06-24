
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Supervisor, Employee, JobCode, Project } from "@/types"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ScrollReveal from "@/components/common/ScrollReveal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getAllEmployeesAction, getAllProjectsAction, getAllJobCodesAction, getAllGradesAction } from "@/lib/actions";

export default function SupervisorEmployeeDetailsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | "all">("all");
  const [selectedJobCode, setSelectedJobCode] = useState<string | "all">("all"); 
  const [selectedGrade, setSelectedGrade] = useState<string | "all">("all");
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allJobCodes, setAllJobCodes] = useState<JobCode[]>([]);
  const [allGrades, setAllGrades] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ProtectedPage allowedRoles={['IS', 'NS', 'DH', 'IC Head']}>
      {(currentUser: User) => {
        const currentSupervisorUser = currentUser as Supervisor;

        useEffect(() => {
          const fetchData = async () => {
            setIsLoading(true);
            try {
              const [employees, projects, jobCodes, grades] = await Promise.all([
                getAllEmployeesAction(),
                getAllProjectsAction(),
                getAllJobCodesAction(),
                getAllGradesAction(),
              ]);
              setAllEmployees(employees);
              setAllProjects(projects);
              setAllJobCodes(jobCodes);
              setAllGrades(grades);
            } catch (error) {
              console.error("Failed to load employee details data:", error);
            } finally {
              setIsLoading(false);
            }
          };
          fetchData();
        }, []);

        const managedEmployeesForFiltering = useMemo(() => {
          let employees: Employee[] = [];
          if (currentSupervisorUser.functionalRole === 'IC Head') {
            employees = allEmployees;
          } else if (currentSupervisorUser.functionalRole === 'DH') {
            employees = allEmployees.filter(emp => emp.dhPSN === currentSupervisorUser.psn);
          } else if (currentSupervisorUser.functionalRole === 'NS') {
            employees = allEmployees.filter(emp => emp.nsPSN === currentSupervisorUser.psn);
          } else if (currentSupervisorUser.functionalRole === 'IS') {
            employees = allEmployees.filter(emp => emp.isPSN === currentSupervisorUser.psn);
          }
          return employees;
        }, [currentSupervisorUser, allEmployees]);
        
        const filteredAndSearchedEmployees = useMemo(() => {
          return managedEmployeesForFiltering.filter(emp => {
            const nameMatch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
            const psnMatch = emp.psn.toString().includes(searchTerm);
            const emailMatch = emp.businessEmail?.toLowerCase().includes(searchTerm.toLowerCase());
            const projectMatch = selectedProject === "all" || emp.project === selectedProject;
            const jobCodeMatch = selectedJobCode === "all" || emp.jobCodeId === selectedJobCode;
            const gradeMatch = selectedGrade === "all" || emp.grade === selectedGrade;
            return (nameMatch || psnMatch || !!emailMatch) && projectMatch && jobCodeMatch && gradeMatch;
          });
        }, [managedEmployeesForFiltering, searchTerm, selectedProject, selectedJobCode, selectedGrade]);
        
        const availableProjects = useMemo(() => {
            const projectIds = new Set(managedEmployeesForFiltering.map(emp => emp.project));
            return allProjects.filter(p => projectIds.has(p.id)).sort((a,b) => a.name.localeCompare(b.name));
        }, [managedEmployeesForFiltering, allProjects]);

        const availableJobCodes = useMemo(() => {
            const jobCodeIdsInUse = new Set(managedEmployeesForFiltering.map(emp => emp.jobCodeId));
            return allJobCodes.filter(jc => jobCodeIdsInUse.has(jc.id)).sort((a,b) => a.description.localeCompare(b.description));
        }, [managedEmployeesForFiltering, allJobCodes]);

        const availableGrades = useMemo(() => {
            const gradesInUse = new Set(managedEmployeesForFiltering.map(emp => emp.grade));
            return allGrades.filter(g => gradesInUse.has(g)); 
        }, [managedEmployeesForFiltering, allGrades]);


        if (isLoading) {
            return (
              <div className="flex flex-col justify-center items-center h-full min-h-[60vh]">
                <LoadingSpinner />
                <p className="mt-2">Loading Employee Data...</p>
              </div>
            )
        }

        return (
            <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8 space-y-6">
              <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h1 className="font-headline text-2xl md:text-3xl font-bold">View Employee Details</h1>
                     <Button variant="outline" asChild>
                        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard</Link>
                    </Button>
                </div>
              </ScrollReveal>

              <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={100}>
                <Card className="shadow-md transition-shadow hover:shadow-lg">
                    <CardHeader>
                        <CardTitle>Filter Employees</CardTitle>
                        <CardDescription>Search by name/PSN/email or filter by project, job code/title, or grade.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Input 
                            placeholder="Search Name, PSN, Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="md:col-span-1"
                        />
                        <Select value={selectedProject} onValueChange={setSelectedProject}>
                            <SelectTrigger><SelectValue placeholder="Filter by Project" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Projects</SelectItem>
                                {availableProjects.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.city})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedJobCode} onValueChange={setSelectedJobCode}>
                            <SelectTrigger><SelectValue placeholder="Filter by Job Code/Title" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Job Codes/Titles</SelectItem>
                                {availableJobCodes.map(jc => (
                                    <SelectItem key={jc.id} value={jc.id}>{jc.code} - {jc.description}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                            <SelectTrigger><SelectValue placeholder="Filter by Grade" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Grades</SelectItem>
                                {availableGrades.map(g => (
                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal animationInClass="animate-fadeInUp" once={false} delayIn={200}>
                {filteredAndSearchedEmployees.length > 0 ? (
                <Card className="shadow-lg transition-shadow hover:shadow-xl">
                    <CardHeader>
                    <CardTitle>Employee List ({filteredAndSearchedEmployees.length})</CardTitle>
                    <CardDescription>Details of employees under your purview matching the criteria.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>PSN</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Job Code (Title)</TableHead>
                                <TableHead className="hidden lg:table-cell">IS</TableHead>
                                <TableHead className="hidden lg:table-cell">NS</TableHead>
                                <TableHead className="hidden lg:table-cell">DH</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {filteredAndSearchedEmployees.map(emp => {
                                const project = allProjects.find(p => p.id === emp.project);
                                const jobCode = allJobCodes.find(jc => jc.id === emp.jobCodeId);
                                return (
                                    <TableRow key={emp.psn}>
                                        <TableCell className="font-medium">{emp.psn}</TableCell>
                                        <TableCell>{emp.name}</TableCell>
                                        <TableCell className="hidden md:table-cell">{emp.businessEmail || 'N/A'}</TableCell>
                                        <TableCell>{project?.name || emp.project}</TableCell>
                                        <TableCell>{emp.grade}</TableCell>
                                        <TableCell>{jobCode?.code} - {jobCode?.description || 'N/A'}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{emp.isName || 'N/A'} ({emp.isPSN || 'N/A'})</TableCell>
                                        <TableCell className="hidden lg:table-cell">{emp.nsName || 'N/A'} ({emp.nsPSN || 'N/A'})</TableCell>
                                        <TableCell className="hidden lg:table-cell">{emp.dhName || 'N/A'} ({emp.dhPSN || 'N/A'})</TableCell>
                                    </TableRow>
                                );
                            })}
                            </TableBody>
                        </Table>
                    </div>
                    </CardContent>
                </Card>
                ) : (
                <Card className="text-center py-10 shadow-lg transition-shadow hover:shadow-xl">
                    <CardContent>
                        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No employees found matching your criteria or under your direct supervision.</p>
                    </CardContent>
                </Card>
                )}
              </ScrollReveal>
            </div>
        );
      }}
    </ProtectedPage>
  );
}
