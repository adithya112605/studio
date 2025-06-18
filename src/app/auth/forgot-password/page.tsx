
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { toast } = useToast();

  const handleSendInstructions = () => {
    toast({
      title: "Action Triggered",
      description: "Password reset instructions would be sent (Feature not implemented).",
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your PSN. If it exists in our system, instructions to reset your password will be processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="psn-forgot">PSN (up to 8 digits)</Label>
            <Input id="psn-forgot" type="number" placeholder="e.g., 10000001" />
          </div>
          <Button className="w-full" onClick={handleSendInstructions}>Send Reset Instructions</Button>
        </CardContent>
        <CardContent className="text-sm text-center">
          <Link href="/auth/signin">
            <Button variant="link">Back to Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
