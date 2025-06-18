
"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound, Palette, BellDot, ShieldAlert, MonitorSmartphone } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle"; 
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <ProtectedPage>
     {(user) => ( 
        <div className="py-8 space-y-8">
          <h1 className="font-headline text-3xl font-bold text-center">Account Settings</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6 text-primary" />
                  <CardTitle className="font-headline text-xl">Profile Information</CardTitle>
                </div>
                <CardDescription>View your profile details. (Editing is not implemented).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-1">
                      <Label htmlFor="psn-settings">PSN</Label>
                      <Input id="psn-settings" value={user.psn.toString()} readOnly disabled />
                  </div>
                  <div className="space-y-1">
                      <Label htmlFor="name-settings">Full Name</Label>
                      <Input id="name-settings" value={user.name} readOnly disabled />
                  </div>
                  <div className="space-y-1">
                      <Label htmlFor="role-settings">Role</Label>
                      <Input id="role-settings" value={user.role} readOnly disabled />
                  </div>
                  {user.project && (
                      <div className="space-y-1">
                          <Label htmlFor="project-settings">Project</Label>
                          <Input id="project-settings" value={user.project} readOnly disabled />
                      </div>
                  )}
              </CardContent>
              <CardFooter>
                  <Button disabled variant="outline">Edit Profile (Not Active)</Button>
              </CardFooter>
            </Card>

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
                  <Input id="current-password" type="password" placeholder="••••••••" disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" disabled />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <Input id="confirm-new-password" type="password" placeholder="••••••••" disabled />
                </div>
                 <Button disabled className="w-full">Update Password (Not Active)</Button>
                <div className="flex items-center justify-between pt-4">
                    <Label htmlFor="2fa-toggle" className="flex flex-col space-y-1">
                        <span>Two-Factor Authentication (2FA)</span>
                        <span className="font-normal leading-snug text-muted-foreground text-xs">
                        Enhance your account security.
                        </span>
                    </Label>
                    <Switch id="2fa-toggle" disabled />
                </div>
              </CardContent>
            </Card>

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
                    <Label htmlFor="font-select">Application Font (Placeholder)</Label>
                    <Select disabled>
                        <SelectTrigger id="font-select">
                            <SelectValue placeholder="Current Font (Lato/Merriweather)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="system">System Default</SelectItem>
                            <SelectItem value="arial">Arial</SelectItem>
                            <SelectItem value="times">Times New Roman</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">User font selection is not yet implemented.</p>
                  </div>
              </CardContent>
            </Card>
            
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
                    <Switch id="email-notif" defaultChecked disabled />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="inapp-notif" className="flex flex-col space-y-1">
                        <span>In-App Notifications</span>
                        <span className="font-normal leading-snug text-muted-foreground text-xs">Show notifications within the app.</span>
                    </Label>
                    <Switch id="inapp-notif" defaultChecked disabled />
                </div>
                <div className="space-y-2 pt-2">
                    <Label htmlFor="notif-freq">Notification Frequency (Placeholder)</Label>
                    <Select disabled>
                        <SelectTrigger id="notif-freq">
                            <SelectValue placeholder="Immediately" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="immediate">Immediately</SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="weekly">Weekly Digest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </CardContent>
               <CardFooter>
                  <Button disabled className="w-full">Save Notification Preferences (Not Active)</Button>
              </CardFooter>
            </Card>
            
          </div>
        </div>
      )}
    </ProtectedPage>
  );
}
