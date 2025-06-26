
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import type { User, Employee, Supervisor, JobCode, Project as ProjectType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Briefcase, Building, Users, CalendarDays, Edit, ShieldCheck, BarChart3, Activity, BadgePercent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/common/ScrollReveal";
import { useState, useEffect } from 'react';
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { 
    getAllEmployeesAction, 
    getJobCodeByIdAction, 
    getProjectByIdAction, 
    getSupervisorByPsnAction 
} from "@/lib/actions";

const getInitials = (name: string = "") => {
  const names = name.split(' ');
  let initials = names[0]?.substring(0, 1).toUpperCase() || '';
  if (names.length > 1) {
    initials += names[names.length - 1]?.substring(0, 1).toUpperCase() || '';
  }
  return initials || 'U'; 
};

const getActingRolesForDisplay = (supervisor: Supervisor, allEmployees: Employee[]): string => {
  const actingRoles = new Set<string>();
  if (!allEmployees || allEmployees.length === 0) return "";

  allEmployees.forEach(emp => {
    if (emp.isPSN === supervisor.psn && supervisor.functionalRole !== 'IS') actingRoles.add('IS');
    if (emp.nsPSN === supervisor.psn && supervisor.functionalRole !== 'NS') actingRoles.add('NS');
    if (emp.dhPSN === supervisor.psn && supervisor.functionalRole !== 'DH') actingRoles.add('DH');
  });
  const rolesArray = Array.from(actingRoles);
  return rolesArray.length > 0 ? ` (also acts as: ${rolesArray.join(', ')})` : "";
}


export default function MyProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [jobCodeInfo, setJobCodeInfo] = useState<JobCode | null>(null);
  const [projectInfo, setProjectInfo] = useState<ProjectType | null>(null);
  const [supervisorChain, setSupervisorChain] = useState<{is?: Supervisor | null, ns?: Supervisor | null, dh?: Supervisor | null}>({});

  const handleEditProfile = () => {
    toast({
      title: "Action Info (Simulated)",
      description: "Profile editing functionality is a placeholder. In a real application, you would be able to edit your details here or via the Settings page.",
      duration: 5000,
    });
  };

  return (
    <ProtectedPage>
      {(currentUser: User) => {
        useEffect(() => {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const isEmployee = currentUser.role === 'Employee';
                    const employeeUser = isEmployee ? currentUser as Employee : null;
                    const supervisorUser = !isEmployee ? currentUser as Supervisor : null;

                    const [employeesData] = await Promise.all([getAllEmployeesAction()]);
                    setAllEmployees(employeesData);

                    if (employeeUser) {
                        const [jobCodeData, projectData, isData, nsData, dhData] = await Promise.all([
                            employeeUser.jobCodeId ? getJobCodeByIdAction(employeeUser.jobCodeId) : Promise.resolve(null),
                            employeeUser.project ? getProjectByIdAction(employeeUser.project) : Promise.resolve(null),
                            employeeUser.isPSN ? getSupervisorByPsnAction(employeeUser.isPSN) : Promise.resolve(null),
                            employeeUser.nsPSN ? getSupervisorByPsnAction(employeeUser.nsPSN) : Promise.resolve(null),
                            employeeUser.dhPSN ? getSupervisorByPsnAction(employeeUser.dhPSN) : Promise.resolve(null),
                        ]);
                        setJobCodeInfo(jobCodeData);
                        setProjectInfo(projectData);
                        setSupervisorChain({ is: isData, ns: nsData, dh: dhData });
                    } else if (supervisorUser) {
                        if (supervisorUser.branchProject) {
                            const foundProject = await getProjectByIdAction(supervisorUser.branchProject);
                             if (foundProject) setProjectInfo(foundProject);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch profile data:", error);
                    toast({ title: "Error", description: "Could not load detailed profile information.", variant: "destructive" });
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }, [currentUser, toast]);

        const isEmployee = currentUser.role === 'Employee';
        const employeeUser = isEmployee ? currentUser as Employee : null;
        const supervisorUser = !isEmployee ? currentUser as Supervisor : null;

        const supervisorRoleTitle = supervisorUser 
          ? `${supervisorUser.title} (${supervisorUser.functionalRole})${getActingRolesForDisplay(supervisorUser, allEmployees)}` 
          : '';

        if (isLoading) {
            return (
                <div className="flex flex-col justify-center items-center py-10">
                    <LoadingSpinner />
                    <p className="mt-2">Loading Your Profile...</p>
                </div>
            )
        }
        
        return (
          <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
            <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
            <Card className="w-full max-w-3xl mx-auto shadow-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
              <CardHeader className="text-center bg-muted/30 p-6">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary shadow-lg">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random&color=fff&size=100`} alt={currentUser.name} data-ai-hint="profile avatar"/>
                  <AvatarFallback className="text-3xl">{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline text-3xl">{currentUser.name}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  {isEmployee ? `Employee | PSN: ${currentUser.psn}` : `${supervisorRoleTitle} | PSN: ${currentUser.psn}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">Personal & Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-primary shrink-0" />
                    <div><strong>Business Email:</strong> {currentUser.businessEmail || 'N/A'}</div>
                  </div>
                  {currentUser.dateOfBirth && (
                    <div className="flex items-center">
                      <CalendarDays className="w-5 h-5 mr-3 text-primary shrink-0" />
                      <div><strong>Date of Birth:</strong> {new Date(currentUser.dateOfBirth).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>

                {isEmployee && employeeUser && (
                    <>
                        <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4 mt-6">Work Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div className="flex items-center">
                                <BadgePercent className="w-5 h-5 mr-3 text-primary shrink-0" />
                                <div><strong>Grade (Pay Level):</strong> {employeeUser.grade}</div>
                            </div>
                            {jobCodeInfo && (
                                <div className="flex items-center">
                                <Activity className="w-5 h-5 mr-3 text-primary shrink-0" />
                                <div><strong>Job Code (Title):</strong> {jobCodeInfo.code} - {jobCodeInfo.description}</div>
                                </div>
                            )}
                            {projectInfo && (
                                <div className="flex items-center">
                                <Building className="w-5 h-5 mr-3 text-primary shrink-0" />
                                <div><strong>Current Project:</strong> {projectInfo.name} ({projectInfo.city})</div>
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4 mt-6">Supervisory Chain</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                            <p><strong>IS:</strong> {supervisorChain.is?.name || employeeUser.isName || 'N/A'} ({employeeUser.isPSN || 'N/A'})</p>
                            <p><strong>NS:</strong> {supervisorChain.ns?.name || employeeUser.nsName || 'N/A'} ({employeeUser.nsPSN || 'N/A'})</p>
                            <p><strong>DH:</strong> {supervisorChain.dh?.name || employeeUser.dhName || 'N/A'} ({employeeUser.dhPSN || 'N/A'})</p>
                        </div>
                    </>
                )}

                {supervisorUser && (
                    <>
                        <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4 mt-6">Supervisory Role Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            {projectInfo && ( 
                                <div className="flex items-center">
                                <Building className="w-5 h-5 mr-3 text-primary shrink-0" />
                                <div><strong>Branch/Primary Project:</strong> {projectInfo.name} ({projectInfo.city})</div>
                                </div>
                            )}
                            {(supervisorUser.ticketsResolved !== undefined || supervisorUser.ticketsPending !== undefined) && (
                                <div className="flex items-center">
                                <BarChart3 className="w-5 h-5 mr-3 text-primary shrink-0" />
                                <div>
                                    <strong>Ticket Stats:</strong> Resolved: {supervisorUser.ticketsResolved || 0} | Pending: {supervisorUser.ticketsPending || 0}
                                </div>
                                </div>
                            )}
                        </div>
                        {supervisorUser.cityAccess && supervisorUser.cityAccess.length > 0 && (
                        <div className="flex items-start mt-4">
                            <ShieldCheck className="w-5 h-5 mr-3 text-primary shrink-0 mt-0.5" />
                            <div><strong className="text-sm">City Access:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {supervisorUser.cityAccess.map(city => <Badge key={city} variant="secondary" className="text-xs">{city}</Badge>)}
                            </div>
                            </div>
                        </div>
                        )}
                        {supervisorUser.projectsHandledIds && supervisorUser.projectsHandledIds.length > 0 && (
                        <div className="flex items-start mt-2">
                            <Users className="w-5 h-5 mr-3 text-primary shrink-0 mt-0.5" />
                            <div><strong className="text-sm">Projects Overseen:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                {/* This is a placeholder as we don't fetch all projects here for performance */}
                                {supervisorUser.projectsHandledIds.slice(0,5).map(id => {
                                    return <Badge key={id} variant="outline" className="text-xs">{id}</Badge> ;
                                })}
                                {supervisorUser.projectsHandledIds.length > 5 && <Badge variant="outline" className="text-xs">...and more</Badge>}
                                </div>
                            </div>
                        </div>
                        )}
                    </>
                )}
              </CardContent>
              <CardFooter className="flex-col space-y-3 items-center p-6 border-t bg-muted/30">
                <Button variant="outline" onClick={handleEditProfile} className="w-full max-w-xs">
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile (Simulated)
                </Button>
                 <Button variant="link" asChild className="text-sm">
                    <Link href="/settings">Go to Account Settings</Link>
                </Button>
              </CardFooter>
            </Card>
            </ScrollReveal>
          </div>
        );
      }}
    </ProtectedPage>
  );
}
    
