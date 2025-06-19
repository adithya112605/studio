
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound, Palette, BellDot, ShieldAlert, MonitorSmartphone, Settings2, ThumbsUp, Activity, Lock, Languages, CalendarClock, MailWarning, Briefcase, Info, AlertTriangle } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle"; 
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User as AuthUser, Employee, Supervisor, JobCode } from "@/types"; 
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { mockJobCodes, mockProjects } from "@/data/mockData"; 
import { Alert, AlertDescription } from "@/components/ui/alert";


export default function SettingsPage() {
  const { toast } = useToast();
  
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


  const handleGenericSave = (featureName: string) => {
    toast({
      title: "Settings Action (Simulated)",
      description: `${featureName} preferences would be saved. This is a mock action.`,
    });
  };
  
  const handlePasswordUpdate = () => {
    toast({
      title: "Security Action (Simulated)",
      description: "Password update functionality is a placeholder. In a real app, this would securely update your password.",
    });
  };

  const handleEditProfile = () => {
     toast({
      title: "Profile Action (Simulated)",
      description: "Profile editing is a placeholder. Changes would typically be managed here or by administrators.",
    });
  };
  
  const viewAuditTrail = () => {
     toast({
      title: "Admin Action (Simulated)",
      description: "Viewing audit trail is a placeholder. This feature would allow tracking of system changes.",
    });
  };


  return (
    <ProtectedPage>
     {(user: AuthUser) => {
        const isEmployee = user.role === 'Employee';
        const isSupervisor = ['IS', 'NS', 'DH', 'IC Head'].includes(user.role);
        const employeeUser = user as Employee; 
        const supervisorUser = user as Supervisor; 

        let jobCodeInfo: JobCode | undefined;
        if(isEmployee && employeeUser.jobCodeId){
            jobCodeInfo = mockJobCodes.find(jc => jc.id === employeeUser.jobCodeId);
        }
        let projectInfo;
        if(isEmployee && employeeUser.project){
            projectInfo = mockProjects.find(p => p.id === employeeUser.project);
        }


        return (
            <div className="py-8 space-y-8">
            <h1 className="font-headline text-3xl font-bold text-center">Account & System Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Profile Information Card */}
                <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                    <User className="w-6 h-6 text-primary" />
                    <CardTitle className="font-headline text-xl">Profile Information</CardTitle>
                    </div>
                    <CardDescription>View your profile details. Editing is a placeholder.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="psn-settings">PSN</Label>
                        <Input id="psn-settings" value={user.psn.toString()} readOnly />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="name-settings">Full Name</Label>
                        <Input id="name-settings" value={user.name} readOnly />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="email-settings">Business Email</Label>
                        <Input id="email-settings" value={user.businessEmail || 'N/A'} readOnly />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="role-settings">Role</Label>
                        <Input id="role-settings" value={isSupervisor ? `${supervisorUser.title} (${supervisorUser.functionalRole})` : user.role} readOnly />
                    </div>
                    {isEmployee && projectInfo && (
                        <div className="space-y-1">
                            <Label htmlFor="project-settings">Current Project</Label>
                            <Input id="project-settings" value={`${projectInfo.name} (${projectInfo.city})`} readOnly />
                        </div>
                    )}
                    {isEmployee && jobCodeInfo && (
                         <div className="space-y-1">
                            <Label htmlFor="jobcode-settings">Job Code</Label>
                            <Input id="jobcode-settings" value={`${jobCodeInfo.code} - ${jobCodeInfo.description}`} readOnly />
                        </div>
                    )}
                     {isEmployee && employeeUser.grade && (
                         <div className="space-y-1">
                            <Label htmlFor="grade-settings">Grade</Label>
                            <Input id="grade-settings" value={employeeUser.grade} readOnly />
                        </div>
                    )}
                    {isSupervisor && supervisorUser.branchProject && (
                         <div className="space-y-1">
                            <Label htmlFor="branch-project-settings">Branch/Primary Project</Label>
                            <Input id="branch-project-settings" value={mockProjects.find(p => p.id === supervisorUser.branchProject)?.name || supervisorUser.branchProject} readOnly />
                        </div>
                    )}
                     {isSupervisor && supervisorUser.cityAccess && supervisorUser.cityAccess.length > 0 && (
                         <div className="space-y-1">
                            <Label htmlFor="city-access-settings">City Access</Label>
                            <Input id="city-access-settings" value={supervisorUser.cityAccess.join(', ')} readOnly />
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={handleEditProfile}>Edit Profile</Button>
                </CardFooter>
                </Card>

                {/* Account Security Card */}
                <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                    <KeyRound className="w-6 h-6 text-primary" />
                    <CardTitle className="font-headline text-xl">Account Security</CardTitle>
                    </div>
                    <CardDescription>Manage your account security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" 
                      onKeyUp={checkCapsLock}
                      onKeyDown={checkCapsLock}
                      onClick={checkCapsLock}
                    />
                    </div>
                    <div className="space-y-1">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" 
                      onKeyUp={checkCapsLock}
                      onKeyDown={checkCapsLock}
                      onClick={checkCapsLock}
                    />
                    </div>
                    <div className="space-y-1">
                    <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                    <Input id="confirm-new-password" type="password" placeholder="••••••••" 
                      onKeyUp={checkCapsLock}
                      onKeyDown={checkCapsLock}
                      onClick={checkCapsLock}
                    />
                    </div>
                     {isCapsLockOn && (
                        <Alert variant="default" className="mt-2 p-2 text-xs bg-yellow-50 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                            Caps Lock is ON.
                            </AlertDescription>
                        </Alert>
                    )}
                    <Button className="w-full" onClick={handlePasswordUpdate}>Update Password</Button>
                    <div className="pt-2">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Password Policy:</p>
                        <ul className="text-xs text-muted-foreground list-disc list-inside">
                            <li>At least 8 characters</li>
                            <li>Uppercase & lowercase letters</li>
                            <li>At least one number</li>
                            <li>At least one special character</li>
                        </ul>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <Label htmlFor="2fa-toggle" className="flex flex-col space-y-1">
                            <span>Two-Factor Authentication (2FA)</span>
                            <span className="font-normal leading-snug text-muted-foreground text-xs">
                            Enhance your account security (Simulated).
                            </span>
                        </Label>
                        <Switch id="2fa-toggle" checked={twoFa} onCheckedChange={(checked) => {setTwoFa(checked); handleGenericSave(`2FA ${checked ? 'Enabled' : 'Disabled'}`);}} />
                    </div>
                </CardContent>
                </Card>

                {/* Appearance Card */}
                <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <Palette className="w-6 h-6 text-primary" />
                        <CardTitle className="font-headline text-xl">Appearance</CardTitle>
                    </div>
                    <CardDescription>Customize the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Theme</Label>
                        <ThemeToggle />
                    </div>
                    <div className="space-y-2 pt-2">
                        <Label htmlFor="font-select">Application Font</Label>
                        <Select disabled onValueChange={(value) => handleGenericSave(`Font changed to ${value}`)}>
                            <SelectTrigger id="font-select">
                                <SelectValue placeholder="Current (Lato/Merriweather)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">Lato/Merriweather (Default)</SelectItem>
                                <SelectItem value="arial">Arial</SelectItem>
                                <SelectItem value="times">Times New Roman</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="language-select">Default Language</Label>
                        <Select defaultValue="en-us" onValueChange={(value) => handleGenericSave(`Language changed to ${value}`)}>
                            <SelectTrigger id="language-select">
                                <SelectValue placeholder="English (US)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en-us">English (US)</SelectItem>
                                <SelectItem value="en-gb">English (UK)</SelectItem>
                                <SelectItem value="hi-in">Hindi (India)</SelectItem>
                                <SelectItem value="ta-in">Tamil (India)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timezone-select">Timezone</Label>
                        <Select defaultValue="ist" onValueChange={(value) => handleGenericSave(`Timezone changed to ${value}`)}>
                            <SelectTrigger id="timezone-select">
                                <SelectValue placeholder="Asia/Kolkata (IST)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem>
                                <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dateformat-select">Date Format</Label>
                        <Select defaultValue="ddmmyyyy" onValueChange={(value) => handleGenericSave(`Date format changed to ${value}`)}>
                            <SelectTrigger id="dateformat-select">
                                <SelectValue placeholder="DD/MM/YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
                                <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
                                <SelectItem value="yyyymmdd">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button className="w-full" onClick={() => handleGenericSave("Appearance")}>Save Appearance Settings</Button>
                </CardFooter>
                </Card>
                
                {/* Notification Preferences Card */}
                <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <BellDot className="w-6 h-6 text-primary" />
                        <CardTitle className="font-headline text-xl">Notification Preferences</CardTitle>
                    </div>
                    <CardDescription>Manage how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="email-notif" className="flex flex-col space-y-1">
                            <span>Email Notifications</span>
                            <span className="font-normal leading-snug text-muted-foreground text-xs">Receive updates via email.</span>
                        </Label>
                        <Switch id="email-notif" checked={emailNotif} onCheckedChange={setEmailNotif} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="sms-notif" className="flex flex-col space-y-1">
                            <span>SMS Notifications</span>
                            <span className="font-normal leading-snug text-muted-foreground text-xs">Receive critical updates via SMS.</span>
                        </Label>
                        <Switch id="sms-notif" checked={smsNotif} onCheckedChange={setSmsNotif} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="inapp-notif" className="flex flex-col space-y-1">
                            <span>In-App Notifications</span>
                            <span className="font-normal leading-snug text-muted-foreground text-xs">Show notifications within the app.</span>
                        </Label>
                        <Switch id="inapp-notif" checked={inAppNotif} onCheckedChange={setInAppNotif} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="summary-emails" className="flex flex-col space-y-1">
                            <span>Digest Emails</span>
                            <span className="font-normal leading-snug text-muted-foreground text-xs">Receive daily/weekly ticket summaries.</span>
                        </Label>
                        <Switch id="summary-emails" checked={digestEmails} onCheckedChange={setDigestEmails} />
                    </div>
                    <div className="space-y-2 pt-2">
                        <Label htmlFor="notif-freq">Notification Frequency</Label>
                        <Select onValueChange={(value) => handleGenericSave(`Notification Frequency set to ${value}`)} defaultValue="immediate">
                            <SelectTrigger id="notif-freq">
                                <SelectValue placeholder="Immediately" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="immediate">Immediately</SelectItem>
                                <SelectItem value="hourly">Hourly Digest</SelectItem>
                                <SelectItem value="daily">Daily Digest</SelectItem>
                                <SelectItem value="weekly">Weekly Digest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => handleGenericSave("Notification")}>Save Notification Preferences</Button>
                </CardFooter>
                </Card>

                {/* Ticket System Settings Card (Visible to DH and IC Head) */}
                {(supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head') && (
                    <Card className="shadow-lg">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <Settings2 className="w-6 h-6 text-primary" />
                            <CardTitle className="font-headline text-xl">Ticket System Settings</CardTitle>
                        </div>
                        <CardDescription>Configure ticket-related system parameters.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="ticket-id-format">Ticket ID Format</Label>
                            <Input id="ticket-id-format" value="#TKXXXXXXX (Alphanumeric)" readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="default-priority">Default Ticket Priority</Label>
                            <Select onValueChange={(value) => handleGenericSave(`Default Priority set to ${value}`)} defaultValue="Medium">
                                <SelectTrigger id="default-priority">
                                    <SelectValue placeholder="Medium" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="auto-close-days">Auto-close Resolved Tickets (Days)</Label>
                            <Input id="auto-close-days" type="number" placeholder="e.g., 7" />
                            <p className="text-xs text-muted-foreground">Days after resolution to auto-close a ticket.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleGenericSave("Ticket System")}>Save Ticket Settings</Button>
                    </CardFooter>
                    </Card>
                )}

                {/* Administrative Settings Card (Visible to IC Head only) */}
                {supervisorUser.functionalRole === 'IC Head' && (
                    <Card className="shadow-lg">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <ShieldAlert className="w-6 h-6 text-primary" />
                            <CardTitle className="font-headline text-xl">Administrative Settings</CardTitle>
                        </div>
                        <CardDescription>Manage core system security and operations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="system-email">System Email Address</Label>
                            <Input id="system-email" type="email" placeholder="notifications@lnthelpdesk.com" />
                            <p className="text-xs text-muted-foreground">Email for sending automated notifications.</p>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="session-timeout">Session Timeout (Minutes)</Label>
                            <Input id="session-timeout" type="number" placeholder="30" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="login-attempts">Login Attempt Lockout (Attempts)</Label>
                            <Input id="login-attempts" type="number" placeholder="5" />
                        </div>
                        <Button variant="outline" className="w-full" onClick={viewAuditTrail}>
                            <Activity className="mr-2 h-4 w-4" /> View Audit Trail
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleGenericSave("Administrative")}>Save Admin Settings</Button>
                    </CardFooter>
                    </Card>
                )}
                
                {/* Feedback & Satisfaction Card (Visible to DH and IC Head) */}
                 {(supervisorUser.functionalRole === 'DH' || supervisorUser.functionalRole === 'IC Head') && (
                    <Card className="shadow-lg">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <ThumbsUp className="w-6 h-6 text-primary" />
                            <CardTitle className="font-headline text-xl">Feedback & Satisfaction</CardTitle>
                        </div>
                        <CardDescription>Manage feedback collection on ticket resolution.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="ticket-rating" className="flex flex-col space-y-1">
                                <span>Enable Ticket Rating</span>
                                <span className="font-normal leading-snug text-muted-foreground text-xs">Allow users to rate resolved tickets.</span>
                            </Label>
                            <Switch id="ticket-rating" checked={ticketRating} onCheckedChange={(checked) => {setTicketRating(checked); handleGenericSave(`Ticket Rating ${checked ? 'Enabled' : 'Disabled'}`);}} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rating-scale">Rating Scale</Label>
                            <Select onValueChange={(value) => handleGenericSave(`Rating Scale set to ${value}`)} defaultValue="5star">
                                <SelectTrigger id="rating-scale">
                                    <SelectValue placeholder="1-5 Stars" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5star">1-5 Stars</SelectItem>
                                    <SelectItem value="10scale">1-10 Scale</SelectItem>
                                    <SelectItem value="thumbs">Thumbs Up/Down</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <Label htmlFor="general-feedback" className="flex flex-col space-y-1">
                                <span>General System Feedback</span>
                                <span className="font-normal leading-snug text-muted-foreground text-xs">Allow users to submit general feedback.</span>
                            </Label>
                            <Switch id="general-feedback" checked={generalFeedback} onCheckedChange={(checked) => {setGeneralFeedback(checked); handleGenericSave(`General Feedback ${checked ? 'Enabled' : 'Disabled'}`);}} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleGenericSave("Feedback")}>Save Feedback Settings</Button>
                    </CardFooter>
                    </Card>
                 )}

            </div>
            </div>
        )
      }}
    </ProtectedPage>
  );
}
