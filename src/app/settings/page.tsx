"use client"

import ProtectedPage from "@/components/common/ProtectedPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound, Palette } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle"; 

export default function SettingsPage() {
  return (
    <ProtectedPage>
     {(user) => ( 
        <div className="py-8 space-y-8">
          <h1 className="font-headline text-3xl font-bold text-center">Account Settings</h1>
          
          <Card className="w-full max-w-xl mx-auto shadow-lg">
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
                    {/* Display PSN as string, even if it's a number, for consistency */}
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

          <Card className="w-full max-w-xl mx-auto shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <KeyRound className="w-6 h-6 text-primary" />
                <CardTitle className="font-headline text-xl">Change Password</CardTitle>
              </div>
              <CardDescription>Update your account password. (Functionality not implemented).</CardDescription>
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
            </CardContent>
            <CardFooter>
                <Button disabled>Update Password (Not Active)</Button>
            </CardFooter>
          </Card>

          <Card className="w-full max-w-xl mx-auto shadow-lg">
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <Palette className="w-6 h-6 text-primary" />
                    <CardTitle className="font-headline text-xl">Appearance</CardTitle>
                </div>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <Label>Theme</Label>
                    <ThemeToggle />
                </div>
            </CardContent>
          </Card>

        </div>
      )}
    </ProtectedPage>
  );
}
