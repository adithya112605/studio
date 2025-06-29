
"use client"

import React, { useState } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import PasswordStrength from './PasswordStrength';
import type { PasswordStrengthResult } from '@/types';
import { Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ScrollReveal from '@/components/common/ScrollReveal';
import { useRouter } from 'next/navigation';

const signUpStep1Schema = z.object({
  psn: z.string() 
    .min(1, "PSN is required.")
    .max(8, "PSN must be 1 to 8 digits.")
    .regex(/^[0-9]+$/, "PSN must be a number."),
});

const signUpStep2Schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters. Ensure it includes uppercase, lowercase, a number, and a special character for best security."),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpStep1Values = z.infer<typeof signUpStep1Schema>;
type SignUpStep2Values = z.infer<typeof signUpStep2Schema>;

const generatePassword = (length = 14): string => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const allChars = lower + upper + digits + symbols;

  let password = "";
  password += lower[Math.floor(Math.random() * lower.length)];
  password += upper[Math.floor(Math.random() * upper.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

export default function SignUpForm() {
  const { checkPSNExists, signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [psnForStep2, setPsnForStep2] = useState<number>(0);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthResult | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const formStep1 = useForm<SignUpStep1Values>({
    resolver: zodResolver(signUpStep1Schema),
    defaultValues: { psn: '' },
  });

  const formStep2 = useForm<SignUpStep2Values>({
    resolver: zodResolver(signUpStep2Schema),
    mode: "onChange",
    defaultValues: { password: '', confirmPassword: '' },
  });

  const watchedPassword = formStep2.watch("password");

  const handlePsnInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    formStep1.setValue("psn", numericValue.slice(0, 8), { shouldValidate: true });
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    formStep2.setValue("password", newPassword, { shouldValidate: true });
    formStep2.setValue("confirmPassword", newPassword, { shouldValidate: true });
    toast({ title: "Password Generated", description: "A new strong password has been generated and filled in." });
  };

  const handlePsnSubmit: SubmitHandler<SignUpStep1Values> = async (data) => {
    const psnNumber = Number(data.psn);
    const { exists, error } = await checkPSNExists(psnNumber);
    
    if (exists) {
      setPsnForStep2(psnNumber);
      setStep(2);
    } else {
      toast({
        title: "PSN Not Found",
        description: error || "This PSN is not found in our database. Please contact an administrator.",
        variant: "destructive",
        duration: 8000
      });
    }
  };

  const handlePasswordSubmit: SubmitHandler<SignUpStep2Values> = async (data) => {
    if (!passwordStrength?.isValid) {
      toast({
        title: "Weak Password",
        description: passwordStrength?.message || "Please choose a stronger password based on the guidelines.",
        variant: "destructive",
      });
      return;
    }
    const result = await signup(psnForStep2, data.password);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  const onConfirmPasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          formStep2.handleSubmit(handlePasswordSubmit)();
      }
  };

  return (
    <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
      <Card className="w-full max-w-md shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create Account</CardTitle>
          {step === 1 && <CardDescription>Enter your L&T PSN to begin. For a demo, you can use PSNs like <strong className="text-primary">10004703</strong> (Employee) or <strong className="text-primary">20192584</strong> (Supervisor).</CardDescription>}
          {step === 2 && <CardDescription>Create a secure password for your account (PSN: {psnForStep2}). Your associated L&T business email will be used for registration.</CardDescription>}
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={formStep1.handleSubmit(handlePsnSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="psn-signup">PSN (up to 8 digits)</Label>
                <Input 
                    id="psn-signup" 
                    {...formStep1.register("psn")}
                    onInput={handlePsnInput}
                    maxLength={8}
                    placeholder="e.g., 10004703" 
                />
                {formStep1.formState.errors.psn && <p className="text-sm text-destructive">{formStep1.formState.errors.psn.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={formStep1.formState.isSubmitting}>
                {formStep1.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify PSN
              </Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={formStep2.handleSubmit(handlePasswordSubmit)} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password-signup">New Password</Label>
                  <Button type="button" variant="link" size="sm" onClick={handleGeneratePassword} className="text-xs p-0 h-auto">
                      <Sparkles className="mr-1 h-3 w-3" /> Generate
                  </Button>
                </div>
                <Controller
                  name="password"
                  control={formStep2.control}
                  render={({ field }) => (
                    <div className="relative">
                      <Input 
                        {...field}
                        id="password-signup" 
                        type={showPassword ? "text" : "password"} 
                        autoComplete="new-password"
                        placeholder="••••••••" 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                />
                <PasswordStrength password={watchedPassword} onStrengthChange={setPasswordStrength} />
                {formStep2.formState.errors.password && <p className="text-sm text-destructive">{formStep2.formState.errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword-signup">Confirm Password</Label>
                <Controller
                  name="confirmPassword"
                  control={formStep2.control}
                  render={({ field }) => (
                     <div className="relative">
                      <Input 
                        {...field}
                        id="confirmPassword-signup" 
                        type={showConfirmPassword ? "text" : "password"} 
                        autoComplete="new-password"
                        placeholder="••••••••" 
                        onKeyDown={onConfirmPasswordKeyDown}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                />
                {formStep2.formState.errors.confirmPassword && <p className="text-sm text-destructive">{formStep2.formState.errors.confirmPassword.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={formStep2.formState.isSubmitting || !passwordStrength?.isValid}>
                {formStep2.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account & Sign In
              </Button>
              <Button variant="outline" onClick={() => setStep(1)} className="w-full" type="button">
                Back to PSN Entry
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-sm text-center block">
          <p>
            Already have an account?{' '}
            <Link href="/auth/signin" passHref>
              <Button variant="link" className="p-0 h-auto">Sign In</Button>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </ScrollReveal>
  );
}
