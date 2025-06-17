"use client"

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PasswordStrength from './PasswordStrength';
import type { PasswordStrengthResult } from '@/types';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const signUpStep1Schema = z.object({
  psn: z.string().length(8, "PSN must be exactly 8 characters"),
});

const signUpStep2Schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpStep1Values = z.infer<typeof signUpStep1Schema>;
type SignUpStep2Values = z.infer<typeof signUpStep2Schema>;

export default function SignUpForm() {
  const { checkPSNExists, signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [psn, setPsn] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthResult | null>(null);

  const formStep1 = useForm<SignUpStep1Values>({
    resolver: zodResolver(signUpStep1Schema),
  });

  const formStep2 = useForm<SignUpStep2Values>({
    resolver: zodResolver(signUpStep2Schema),
    mode: "onChange" 
  });
  
  const watchedPassword = formStep2.watch("password");

  const handlePsnSubmit: SubmitHandler<SignUpStep1Values> = async (data) => {
    setIsLoading(true);
    const exists = await checkPSNExists(data.psn);
    setIsLoading(false);
    if (exists) {
      setPsn(data.psn);
      setStep(2);
    } else {
      toast({
        title: "PSN Not Found",
        description: "This PSN is not registered in our system. Please contact L&T Admin.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit: SubmitHandler<SignUpStep2Values> = async (data) => {
    if (!passwordStrength?.isValid) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password based on the guidelines.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const result = await signup(psn, data.password);
    setIsLoading(false);
    if (result.success) {
      toast({ title: "Account Created!", description: "You are now logged in. Redirecting to dashboard..."});
      router.push('/dashboard');
    } else {
      toast({
        title: "Signup Failed",
        description: result.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Account</CardTitle>
        {step === 1 && <CardDescription>Enter your 8-digit L&T PSN to begin.</CardDescription>}
        {step === 2 && <CardDescription>Create a secure password for your account (PSN: {psn}).</CardDescription>}
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <form onSubmit={formStep1.handleSubmit(handlePsnSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="psn-signup">PSN (8-digit ID)</Label>
              <Input id="psn-signup" {...formStep1.register("psn")} placeholder="E.g., EMP00001" />
              {formStep1.formState.errors.psn && <p className="text-sm text-destructive">{formStep1.formState.errors.psn.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify PSN
            </Button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={formStep2.handleSubmit(handlePasswordSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password-signup">New Password</Label>
              <Input id="password-signup" type="password" {...formStep2.register("password")} placeholder="••••••••" />
              <PasswordStrength password={watchedPassword} onStrengthChange={setPasswordStrength} />
              {formStep2.formState.errors.password && <p className="text-sm text-destructive">{formStep2.formState.errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...formStep2.register("confirmPassword")} placeholder="••••••••" />
              {formStep2.formState.errors.confirmPassword && <p className="text-sm text-destructive">{formStep2.formState.errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !passwordStrength?.isValid}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <Button variant="link" onClick={() => setStep(1)} className="w-full">
              Back to PSN Entry
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="text-sm">
        <p>
          Already have an account?{' '}
          <Link href="/auth/signin" passHref>
            <Button variant="link" className="p-0 h-auto">Sign In</Button>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
