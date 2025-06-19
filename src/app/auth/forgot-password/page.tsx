
"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { mockEmployees, mockSupervisors, allMockUsers } from "@/data/mockData"; // Import allMockUsers
import { Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  psn: z.string() // Changed to string for maxLength
    .min(1, "PSN is required.")
    .max(8, "PSN must be 1 to 8 digits.")
    .regex(/^[0-9]+$/, "PSN must be a number."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handlePsnInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setValue("psn", numericValue.slice(0, 8), { shouldValidate: true });
  };

  const handleSendInstructions: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    const psnNumber = Number(data.psn);
    const userAccount = allMockUsers.find(u => u.psn === psnNumber);

    if (userAccount && userAccount.businessEmail) {
      toast({
        title: "Reset Instructions (Simulated)",
        description: `If a matching account exists, password reset instructions would be sent to ${userAccount.businessEmail}. (This is a simulation, no email will be sent).`,
        duration: 7000,
      });
    } else if (userAccount && !userAccount.businessEmail) {
       toast({
        title: "Email Not Found (Simulated)",
        description: `Account ${psnNumber} found, but no business email is registered. Please contact Admin.`,
        variant: "default",
        duration: 7000,
      });
    } else {
      toast({
        title: "PSN Not Found",
        description: `No account found for PSN ${data.psn}. Please check the PSN or contact Admin.`,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your PSN. If it exists in our system, instructions to reset your password will be processed (simulated).
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(handleSendInstructions)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="psn-forgot">PSN (up to 8 digits)</Label>
              <Input 
                id="psn-forgot" 
                type="text" // Changed for maxLength
                {...register("psn")}
                onInput={handlePsnInput}
                maxLength={8}
                placeholder="e.g., 10000001" 
              />
              {errors.psn && <p className="text-sm text-destructive">{errors.psn.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Instructions
            </Button>
          </CardContent>
        </form>
        <CardContent className="text-sm text-center mt-4 border-t pt-4">
          <Link href="/auth/signin">
            <Button variant="link">Back to Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
