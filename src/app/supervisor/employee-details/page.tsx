
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Supervisor, Employee, JobCode, Project as ProjectType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mockEmployees, mockSupervisors, mockJobCodes, mockProjects } from "@/data/mockData";
import { Users, ArrowLeft, Filter, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function SupervisorEmployeeDetailsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | "all">("all");
  const [selectedJobCode, setSelectedJobCode] = useState<string | "all">("all");


  return (
    <ProtectedPage allowedRoles={['IS', 'NS', 'DH', 'IC Head']}>
      {(currentUser: User) => {
        const currentSupervisorUser = currentUser as Supervisor;

        const managedEmployees = useMemo(() => {
          let employees: Employee[] = [];
          if (currentSupervisorUser.functionalRole === 'IC Head') {
            employees = mockEmployees;
          } else if (currentSupervisorUser.functionalRole === 'DH') {
            const dhProjects = mockProjects.filter(p => currentSupervisorUser.cityAccess?.includes(p.city));
            const dhProjectIds = dhProjects.map(p => p.id);
            employees = mockEmployees.filter(emp => emp.dhPSN === currentSupervisorUser.psn || (emp.project && dhProjectIds.includes(emp.project)));
          } else if (currentSupervisorUser.functionalRole === 'NS') {
            employees = mockEmployees.filter(emp => emp.nsPSN === currentSupervisorUser.psn);
          } else if (currentSupervisorUser.functionalRole === 'IS') {
            employees = mockEmployees.filter(emp => emp.isPSN === currentSupervisorUser.psn);
          }

          return employees.filter(emp => {
            const nameMatch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
            const psnMatch = emp.psn.toString().includes(searchTerm);
            const projectMatch = selectedProject === "all" || emp.project === selectedProject;
            const jobCodeMatch = selectedJobCode === "all" || emp.jobCodeId === selectedJobCode;
            return (nameMatch || psnMatch) && projectMatch && jobCodeMatch;
          });
        }, [currentSupervisorUser, searchTerm, selectedProject, selectedJobCode]);
        
        const availableProjects = useMemo(() => {
            const projectIds = new Set(managedEmployees.map(emp => emp.project));
            return mockProjects.filter(p => projectIds.has(p.id));
        }, [managedEmployees]);

        const availableJobCodes = useMemo(() => {
            const jobCodeIds = new Set(managedEmployees.map(emp => emp.jobCodeId));
            return mockJobCodes.filter(jc => jobCodeIds.has(jc.id));
        }, [managedEmployees]);


        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="font-headline text-3xl font-bold">View Employee Details</h1>
                     <Button variant="outline" asChild>
                        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Employees</CardTitle>
                        <CardDescription>Search by name/PSN or filter by project/job code.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input 
                            placeholder="Search by Name or PSN..."
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
                            <SelectTrigger><SelectValue placeholder="Filter by Job Code" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Job Codes</SelectItem>
                                {availableJobCodes.map(jc => (
                                    <SelectItem key={jc.id} value={jc.id}>{jc.code} - {jc.description}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>


                {managedEmployees.length > 0 ? (
                <Card className="shadow-lg">
                    <CardHeader>
                    <CardTitle>Employee List</CardTitle>
                    <CardDescription>Details of employees under your purview.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>PSN</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Job Code</TableHead>
                            <TableHead>IS</TableHead>
                            <TableHead>NS</TableHead>
                            <TableHead>DH</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {managedEmployees.map(emp => {
                            const project = mockProjects.find(p => p.id === emp.project);
                            const jobCode = mockJobCodes.find(jc => jc.id === emp.jobCodeId);
                            return (
                                <TableRow key={emp.psn}>
                                    <TableCell className="font-medium">{emp.psn}</TableCell>
                                    <TableCell>{emp.name}</TableCell>
                                    <TableCell>{emp.businessEmail || 'N/A'}</TableCell>
                                    <TableCell>{project?.name || emp.project}</TableCell>
                                    <TableCell>{jobCode?.code || 'N/A'}</TableCell>
                                    <TableCell>{emp.isName || 'N/A'} ({emp.isPSN || 'N/A'})</TableCell>
                                    <TableCell>{emp.nsName || 'N/A'} ({emp.nsPSN || 'N/A'})</TableCell>
                                    <TableCell>{emp.dhName || 'N/A'} ({emp.dhPSN || 'N/A'})</TableCell>
                                </TableRow>
                            );
                        })}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
                ) : (
                <Card className="text-center py-8 shadow-lg">
                    <CardContent>
                        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No employees found matching your criteria or under your direct supervision.</p>
                    </CardContent>
                </Card>
                )}
            </div>
        );
      }}
    </ProtectedPage>
  );
}

