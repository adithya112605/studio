
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
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const signUpStep1Schema = z.object({
  psn: z.coerce.number().int().positive("PSN must be a positive number.").refine(val => val.toString().length > 0 && val.toString().length <= 8, { message: "PSN must be a number with 1 to 8 digits." }),
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
  const [psnForStep2, setPsnForStep2] = useState<number>(0);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthResult | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      setPsnForStep2(data.psn);
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
    const result = await signup(psnForStep2, data.password);
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
        {step === 1 && <CardDescription>Enter your L&T PSN (up to 8 digits) to begin.</CardDescription>}
        {step === 2 && <CardDescription>Create a secure password for your account (PSN: {psnForStep2}).</CardDescription>}
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <form onSubmit={formStep1.handleSubmit(handlePsnSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="psn-signup">PSN (up to 8 digits)</Label>
              <Input id="psn-signup" type="number" {...formStep1.register("psn")} placeholder="e.g., 10000001" />
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
              <div className="relative">
                <Input id="password-signup" type={showPassword ? "text" : "password"} {...formStep2.register("password")} placeholder="••••••••" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <PasswordStrength password={watchedPassword} onStrengthChange={setPasswordStrength} />
              {formStep2.formState.errors.password && <p className="text-sm text-destructive">{formStep2.formState.errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword-signup">Confirm Password</Label>
              <div className="relative">
                <Input id="confirmPassword-signup" type={showConfirmPassword ? "text" : "password"} {...formStep2.register("confirmPassword")} placeholder="••••••••" />
                 <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
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
