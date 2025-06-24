
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound, Palette, BellDot, ShieldAlert, Settings2 as SettingsIcon, ThumbsUp, Activity, Lock, Languages, CalendarClock, MailWarning, Briefcase, Info, AlertTriangle, UserCircle, Cog, SlidersHorizontal, Accessibility, FileText, Edit, CreditCard } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User as AuthUser, Employee, Supervisor, JobCode, Project } from "@/types";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ScrollReveal from "@/components/common/ScrollReveal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { cn } from "@/lib/utils";
import { getAllEmployeesAction, getJobCodeByIdAction, getProjectByIdAction } from "@/lib/actions";

const getActingRolesForSettingsDisplay = (supervisor: Supervisor, allEmployees: Employee[]): string => {
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

type SettingsTab = 'profile' | 'security' | 'appearance' | 'notifications' | 'ticketSystem' | 'administrative' | 'feedback' | 'accessibility' | 'billing';

const SettingsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const [emailNotif, setEmailNotif] = useState(true);
  const [inAppNotif, setInAppNotif] = useState(true);
  const [twoFa, setTwoFa] = useState(false);
  const [smsNotif, setSmsNotif] = useState(false);
  const [digestEmails, setDigestEmails] = useState(false);
  const [ticketRating, setTicketRating] = useState(false);
  const [generalFeedback, setGeneralFeedback] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const checkCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof event.getModifierState === 'function') {
      setIsCapsLockOn(event.getModifierState("CapsLock"));
    }
  };

  const handleGenericSave = (featureName: string, specificSetting?: string) => {
    toast({
      title: "Settings Action (Simulated)",
      description: `${featureName} ${specificSetting ? `(${specificSetting})` : ''} preferences would be saved. This is a mock action.`,
    });
  };

  const handlePasswordUpdate = () => {
    toast({
      title: "Security Action (Simulated)",
      description: "Password update functionality is a placeholder. In a real app, this would securely update your password.",
    });
  };

  const ProfileSection = ({ currentUser }: { currentUser: AuthUser }) => {
    const [jobCodeInfo, setJobCodeInfo] = useState<JobCode | null>(null);
    const [projectInfo, setProjectInfo] = useState<Project | null>(null);
    const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const isEmployee = currentUser.role === 'Employee';
    const employeeUser = currentUser as Employee;
    const supervisorUser = currentUser as Supervisor;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (!isEmployee) {
                    const employees = await getAllEmployeesAction();
                    setAllEmployees(employees);
                }
                if (isEmployee && employeeUser.jobCodeId) {
                    const jc = await getJobCodeByIdAction(employeeUser.jobCodeId);
                    setJobCodeInfo(jc);
                }
                if (isEmployee && employeeUser.project) {
                    const p = await getProjectByIdAction(employeeUser.project);
                    setProjectInfo(p);
                }
                if (!isEmployee && supervisorUser.branchProject) {
                    const p = await getProjectByIdAction(supervisorUser.branchProject);
                    setProjectInfo(p);
                }
            } catch (error) {
                console.error("Error fetching profile details", error);
                toast({title: "Error", description: "Could not load detailed profile info.", variant: "destructive"})
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentUser, isEmployee, employeeUser, supervisorUser, toast]);

    let supervisorRoleDisplay = "";
    if (!isEmployee) {
        supervisorRoleDisplay = `${supervisorUser.title} (${supervisorUser.functionalRole})${getActingRolesForSettingsDisplay(supervisorUser, allEmployees)}`;
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                 <h2 className="text-2xl font-semibold text-foreground">Public Profile</h2>
                 <div className="p-6 border rounded-lg bg-card flex flex-col items-center justify-center">
                    <LoadingSpinner size="sm"/>
                    <p className="mt-2 text-muted-foreground">Loading profile details...</p>
                 </div>
            </div>
        )
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Public Profile</h2>
        <p className="text-muted-foreground">This information will be displayed publicly so be careful what you share.</p>
        <div className="space-y-4 p-6 border rounded-lg bg-card transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>PSN</Label><Input value={currentUser.psn.toString()} readOnly className="mt-1"/></div>
                <div><Label>Full Name</Label><Input value={currentUser.name} readOnly className="mt-1"/></div>
                <div><Label>Business Email</Label><Input value={currentUser.businessEmail || 'N/A'} readOnly className="mt-1"/></div>
                <div><Label>Role</Label><Input value={isEmployee ? currentUser.role : supervisorRoleDisplay} readOnly className="mt-1"/></div>
                {isEmployee && projectInfo && <div><Label>Current Project</Label><Input value={`${projectInfo.name} (${projectInfo.city})`} readOnly className="mt-1"/></div>}
                {isEmployee && jobCodeInfo && <div><Label>Job Code</Label><Input value={`${jobCodeInfo.code} - ${jobCodeInfo.description}`} readOnly className="mt-1"/></div>}
                {isEmployee && employeeUser.grade && <div><Label>Grade</Label><Input value={employeeUser.grade} readOnly className="mt-1"/></div>}
                {!isEmployee && projectInfo && <div><Label>Branch/Primary Project</Label><Input value={projectInfo.name} readOnly className="mt-1"/></div>}
            </div>
            <Button variant="outline" onClick={() => handleGenericSave("Profile", "Edit Profile")} className="mt-4"><Edit className="mr-2"/>Edit Profile (Simulated)</Button>
        </div>
      </div>
    );
  };

  const SecuritySection = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Password</h2>
        <p className="text-muted-foreground">Update your password. Choose a strong and unique password.</p>
        <div className="space-y-4 p-6 border rounded-lg bg-card transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
            <div><Label htmlFor="current-password">Current Password</Label><Input id="current-password" type="password" placeholder="••••••••" onKeyUp={checkCapsLock} onKeyDown={checkCapsLock} onClick={checkCapsLock} className="mt-1"/></div>
            <div><Label htmlFor="new-password">New Password</Label><Input id="new-password" type="password" placeholder="••••••••" onKeyUp={checkCapsLock} onKeyDown={checkCapsLock} onClick={checkCapsLock} className="mt-1"/></div>
            <div><Label htmlFor="confirm-new-password">Confirm New Password</Label><Input id="confirm-new-password" type="password" placeholder="••••••••" onKeyUp={checkCapsLock} onKeyDown={checkCapsLock} onClick={checkCapsLock} className="mt-1"/></div>
            {isCapsLockOn && <Alert variant="default" className="mt-2 p-3 text-sm bg-yellow-50 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700 flex items-center"><AlertTriangle className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" /> <AlertDescription className="text-yellow-700 dark:text-yellow-300">Caps Lock is ON.</AlertDescription></Alert>}
            <div className="pt-2"><p className="text-xs text-muted-foreground font-medium mb-1">Password Policy:</p><ul className="text-xs text-muted-foreground list-disc list-inside"><li>At least 8 characters</li><li>Uppercase & lowercase letters</li><li>At least one number</li><li>At least one special character</li></ul></div>
            <Button className="w-full mt-4" onClick={handlePasswordUpdate}>Update Password</Button>
        </div>
        <div className="p-6 border rounded-lg bg-card space-y-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="2fa-toggle" className="font-semibold">Two-Factor Authentication (2FA)</Label>
                    <p className="text-sm text-muted-foreground">Enhance your account security (Simulated).</p>
                </div>
                <Switch id="2fa-toggle" checked={twoFa} onCheckedChange={(checked) => {setTwoFa(checked); handleGenericSave("Security", `2FA ${checked ? 'Enabled' : 'Disabled'}`);}} />
            </div>
        </div>
    </div>
  );

  const AppearanceSettingItem = ({ title, description, children }: {title: string, description: string, children: React.ReactNode}) => (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
        <div>
            <h4 className="font-medium text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
    </div>
  );

  const AppearanceSection = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Appearance</h2>
        <p className="text-muted-foreground">Customize the look and feel of the application to your preference.</p>
        <div className="p-6 border rounded-lg bg-card transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
            <AppearanceSettingItem title="Theme" description="Select your preferred light or dark mode."> <ThemeToggle /> </AppearanceSettingItem>
            <AppearanceSettingItem title="Application Font" description="Choose the display font for the interface."> <Select disabled onValueChange={(value) => handleGenericSave("Appearance", `Font changed to ${value}`)}> <SelectTrigger className="w-[180px]"><SelectValue placeholder="Current (Inter)" /></SelectTrigger> <SelectContent> <SelectItem value="system">Inter (Default)</SelectItem> </SelectContent> </Select> </AppearanceSettingItem>
            <AppearanceSettingItem title="Default Language" description="Set your preferred language."> <Select defaultValue="en-us" onValueChange={(value) => handleGenericSave("Appearance", `Language changed to ${value}`)} > <SelectTrigger className="w-[180px]"><SelectValue placeholder="English (US)" /></SelectTrigger> <SelectContent> <SelectItem value="en-us">English (US)</SelectItem> <SelectItem value="en-gb">English (UK)</SelectItem> <SelectItem value="hi-in">Hindi (India)</SelectItem></SelectContent> </Select> </AppearanceSettingItem>
            <AppearanceSettingItem title="Timezone" description="Select your local timezone."> <Select defaultValue="ist" onValueChange={(value) => handleGenericSave("Appearance", `Timezone changed to ${value}`)}> <SelectTrigger className="w-[180px]"><SelectValue placeholder="Asia/Kolkata (IST)" /></SelectTrigger> <SelectContent> <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem></SelectContent> </Select> </AppearanceSettingItem>
            <AppearanceSettingItem title="Date Format" description="Choose how dates are displayed."> <Select defaultValue="ddmmyyyy" onValueChange={(value) => handleGenericSave("Appearance", `Date format to ${value}`)}> <SelectTrigger className="w-[180px]"><SelectValue placeholder="DD/MM/YYYY" /></SelectTrigger> <SelectContent> <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem><SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem> </SelectContent> </Select> </AppearanceSettingItem>
        </div>
    </div>
  );

  const NotificationSettingItem = ({ title, description, id, checked, onCheckedChange }: {title: string, description: string, id: string, checked: boolean, onCheckedChange: (checked: boolean) => void }) => (
     <div className="flex items-center justify-between py-4 border-b last:border-b-0">
        <div>
            <Label htmlFor={id} className="font-semibold text-md">{title}</Label>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Switch id={id} checked={checked} onCheckedChange={(val) => {onCheckedChange(val); handleGenericSave("Notifications", `${title} ${val ? 'Enabled' : 'Disabled'}`);}} />
    </div>
  );

  const NotificationsSection = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Notifications</h2>
        <p className="text-muted-foreground">Manage how you receive notifications from the helpdesk system.</p>
        <div className="p-6 border rounded-lg bg-card transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
            <NotificationSettingItem title="Email Notifications" description="Receive updates via email for ticket activity." id="email-notif" checked={emailNotif} onCheckedChange={setEmailNotif} />
            <NotificationSettingItem title="SMS Notifications" description="Receive critical alerts and updates via SMS." id="sms-notif" checked={smsNotif} onCheckedChange={setSmsNotif} />
            <NotificationSettingItem title="In-App Notifications" description="Show banners and alerts within the application." id="inapp-notif" checked={inAppNotif} onCheckedChange={setInAppNotif} />
            <NotificationSettingItem title="Digest Emails" description="Get daily or weekly summaries of ticket activity." id="summary-emails" checked={digestEmails} onCheckedChange={setDigestEmails} />
            <div className="flex items-center justify-between py-4">
                <div>
                    <Label htmlFor="notif-freq" className="font-semibold text-md">Notification Frequency</Label>
                    <p className="text-sm text-muted-foreground">Choose how often you receive digest notifications.</p>
                </div>
                <Select onValueChange={(value) => handleGenericSave("Notifications", `Frequency set to ${value}`)} defaultValue="immediate">
                    <SelectTrigger id="notif-freq" className="w-[180px]"><SelectValue placeholder="Immediately" /></SelectTrigger>
                    <SelectContent><SelectItem value="immediate">Immediately</SelectItem><SelectItem value="hourly">Hourly</SelectItem><SelectItem value="daily">Daily</SelectItem></SelectContent>
                </Select>
            </div>
        </div>
    </div>
  );

  const SupervisorSettingItem = ({ title, description, children }: { title: string, description: string, children: React.ReactNode}) => (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
        <div>
            <h4 className="font-medium text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="min-w-[180px] flex justify-end">{children}</div>
    </div>
  );
  
  const TicketSystemSection = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Ticket System Settings</h2>
        <p className="text-muted-foreground">Configure ticket-related system parameters (Admin Access).</p>
        <div className="p-6 border rounded-lg bg-card transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
            <SupervisorSettingItem title="Ticket ID Format" description="System-defined ticket identifier format."> <Input value="TKXXXXXXX (Alphanumeric)" readOnly className="w-[200px]"/> </SupervisorSettingItem>
            <SupervisorSettingItem title="Default Ticket Priority" description="Set the initial priority for new tickets."> <Select onValueChange={(value) => handleGenericSave("Ticket System", `Default Priority: ${value}`)} defaultValue="Medium"> <SelectTrigger className="w-[180px]"><SelectValue placeholder="Medium" /></SelectTrigger> <SelectContent> <SelectItem value="Low">Low</SelectItem> <SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem> </SelectContent> </Select> </SupervisorSettingItem>
            <SupervisorSettingItem title="Auto-close Resolved Tickets" description="Days after resolution to auto-close."> <Input type="number" placeholder="e.g., 7" className="w-[180px]" onChange={(e) => handleGenericSave("Ticket System", `Auto-close days: ${e.target.value}`)} /> </SupervisorSettingItem>
        </div>
    </div>
  );

  const AdministrativeSection = () => (
     <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Administrative Settings</h2>
        <p className="text-muted-foreground">Manage core system security and operations (IC Head Access).</p>
        <div className="p-6 border rounded-lg bg-card transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
            <SupervisorSettingItem title="System Email Address" description="Email for automated notifications."> <Input type="email" placeholder="notifications@lnthelpdesk.com" className="w-[240px]" onChange={(e) => handleGenericSave("Administrative", `System Email: ${e.target.value}`)} /> </SupervisorSettingItem>
            <SupervisorSettingItem title="Session Timeout (Minutes)" description="Idle time before auto-logout."> <Input type="number" placeholder="30" className="w-[180px]" onChange={(e) => handleGenericSave("Administrative", `Session Timeout: ${e.target.value}`)} /> </SupervisorSettingItem>
            <SupervisorSettingItem title="Login Attempt Lockout" description="Attempts before account lockout."> <Input type="number" placeholder="5" className="w-[180px]" onChange={(e) => handleGenericSave("Administrative", `Login Attempts: ${e.target.value}`)} /> </SupervisorSettingItem>
            <div className="pt-4"> <Button variant="outline" className="w-full" onClick={() => handleGenericSave("Administrative", "View Audit Trail")}> <Activity className="mr-2 h-4 w-4" /> View Audit Trail </Button> </div>
        </div>
    </div>
  );

  const FeedbackSection = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Feedback & Satisfaction</h2>
        <p className="text-muted-foreground">Manage feedback collection on ticket resolution (Admin Access).</p>
        <div className="p-6 border rounded-lg bg-card transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
            <SupervisorSettingItem title="Enable Ticket Rating" description="Allow users to rate resolved tickets.">  <Switch checked={ticketRating} onCheckedChange={(checked) => {setTicketRating(checked); handleGenericSave("Feedback", `Ticket Rating ${checked ? 'Enabled' : 'Disabled'}`);}} /> </SupervisorSettingItem>
            <SupervisorSettingItem title="Rating Scale" description="Define the scale for ticket ratings."> <Select onValueChange={(value) => handleGenericSave("Feedback", `Rating Scale: ${value}`)} defaultValue="5star"> <SelectTrigger className="w-[180px]"><SelectValue placeholder="1-5 Stars" /></SelectTrigger> <SelectContent> <SelectItem value="5star">1-5 Stars</SelectItem> <SelectItem value="thumbs">Thumbs Up/Down</SelectItem></SelectContent> </Select></SupervisorSettingItem>
            <SupervisorSettingItem title="General System Feedback" description="Allow users to submit general feedback."> <Switch checked={generalFeedback} onCheckedChange={(checked) => {setGeneralFeedback(checked); handleGenericSave("Feedback", `General Feedback ${checked ? 'Enabled' : 'Disabled'}`);}} /> </SupervisorSettingItem>
        </div>
    </div>
  );
  
  const AccessibilitySection = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Accessibility</h2>
        <p className="text-muted-foreground">Adjust settings to improve your experience with the application.</p>
        <div className="p-6 border rounded-lg bg-card transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
             <AppearanceSettingItem title="High Contrast Mode" description="Increase text and UI element contrast."> <Switch onCheckedChange={(val) => handleGenericSave("Accessibility", `High Contrast ${val ? 'On' : 'Off'}`)} /> </AppearanceSettingItem>
             <AppearanceSettingItem title="Font Size" description="Adjust the global font size."> <Select defaultValue="medium" onValueChange={(val) => handleGenericSave("Accessibility", `Font Size: ${val}`)}> <SelectTrigger className="w-[180px]"><SelectValue placeholder="Medium" /></SelectTrigger><SelectContent><SelectItem value="small">Small</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="large">Large</SelectItem></SelectContent></Select> </AppearanceSettingItem>
             <AppearanceSettingItem title="Keyboard Navigation" description="Enhance focus visibility for keyboard users."> <Switch defaultChecked onCheckedChange={(val) => handleGenericSave("Accessibility", `Keyboard Nav Focus ${val ? 'On' : 'Off'}`)} /> </AppearanceSettingItem>
             <p className="text-sm text-muted-foreground pt-4">More accessibility features coming soon.</p>
        </div>
    </div>
  );

  const BillingSection = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Billing & Plans</h2>
        <p className="text-muted-foreground">This is an internal L&T helpdesk. Billing and plans are not applicable.</p>
        <div className="p-6 border rounded-lg bg-card transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
            <Info className="w-6 h-6 text-primary mb-2"/>
            <p className="text-muted-foreground">This platform is provided for internal use by Larsen & Toubro employees and does not involve direct billing or subscription plans for individual users.</p>
            <p className="text-muted-foreground mt-2">For departmental cost allocations or IT service inquiries, please contact your respective manager or the IT department.</p>
        </div>
    </div>
  );


  return (
    <ProtectedPage>
     {(user: AuthUser) => {
        const supervisorUser = user.role !== 'Employee' ? user as Supervisor : null;

        const sidebarItems: {key: SettingsTab, label: string, icon: React.ElementType, adminOnly?: ('DH' | 'IC Head')[] }[] = [
          { key: 'profile', label: 'Public Profile', icon: UserCircle },
          { key: 'security', label: 'Password', icon: KeyRound },
          { key: 'appearance', label: 'Appearance', icon: Palette },
          { key: 'accessibility', label: 'Accessibility', icon: Accessibility },
          { key: 'notifications', label: 'Notifications', icon: BellDot },
          { key: 'billing', label: 'Billing and plans', icon: CreditCard },
          { key: 'ticketSystem', label: 'Ticket System', icon: SettingsIcon, adminOnly: ['DH', 'IC Head'] },
          { key: 'administrative', label: 'Administrative', icon: ShieldAlert, adminOnly: ['IC Head'] },
          { key: 'feedback', label: 'Feedback', icon: ThumbsUp, adminOnly: ['DH', 'IC Head'] },
        ];

        const availableSidebarItems = sidebarItems.filter(item => {
            if (!item.adminOnly) return true;
            if (!supervisorUser) return false;
            return item.adminOnly.includes(supervisorUser.functionalRole);
        });

        return (
            <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <nav className="md:w-60 lg:w-72 shrink-0 space-y-1 md:sticky md:top-24">
                    {availableSidebarItems.map(item => (
                        <Button
                            key={item.key}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-md px-3 py-2.5 h-auto",
                                activeTab === item.key ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                            onClick={() => setActiveTab(item.key)}
                        >
                            <item.icon className={cn("mr-3 h-5 w-5", activeTab === item.key ? "text-primary" : "")} />
                            {item.label}
                        </Button>
                    ))}
                </nav>

                <main className="flex-1 min-w-0">
                  <ScrollReveal key={activeTab} animationInClass="animate-fadeInUp" once={false}>
                    {activeTab === 'profile' && <ProfileSection currentUser={user} />}
                    {activeTab === 'security' && <SecuritySection />}
                    {activeTab === 'appearance' && <AppearanceSection />}
                    {activeTab === 'notifications' && <NotificationsSection />}
                    {activeTab === 'accessibility' && <AccessibilitySection />}
                    {activeTab === 'billing' && <BillingSection />}
                    {activeTab === 'ticketSystem' && supervisorUser && (supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head') && <TicketSystemSection />}
                    {activeTab === 'administrative' && supervisorUser && supervisorUser.functionalRole === 'IC Head' && <AdministrativeSection />}
                    {activeTab === 'feedback' && supervisorUser && (supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head') && <FeedbackSection />}
                  </ScrollReveal>
                </main>
              </div>
            </div>
        );
      }}
    </ProtectedPage>
  );
}

export default SettingsPage;
