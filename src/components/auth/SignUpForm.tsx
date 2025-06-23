
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
import PasswordStrength from './PasswordStrength';
import type { PasswordStrengthResult } from '@/types';
import { Loader2, Eye, EyeOff, AlertTriangle, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ScrollReveal from '@/components/common/ScrollReveal';

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
  // Ensure at least one of each character type
  password += lower[Math.floor(Math.random() * lower.length)];
  password += upper[Math.floor(Math.random() * upper.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest of the password length with random characters from all sets
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password string to avoid predictable patterns (e.g., 'aZ1!...')
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

export default function SignUpForm() {
  const { checkPSNExists, signup } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [psnForStep2, setPsnForStep2] = useState<number>(0);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthResult | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const formStep1 = useForm<SignUpStep1Values>({
    resolver: zodResolver(signUpStep1Schema),
  });

  const formStep2 = useForm<SignUpStep2Values>({
    resolver: zodResolver(signUpStep2Schema),
    mode: "onChange" 
  });

  const watchedPassword = formStep2.watch("password");

  const handlePsnInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    formStep1.setValue("psn", numericValue.slice(0, 8), { shouldValidate: true });
  };

  const checkCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof event.getModifierState === 'function') {
      setIsCapsLockOn(event.getModifierState("CapsLock"));
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    formStep2.setValue("password", newPassword, { shouldValidate: true });
    formStep2.setValue("confirmPassword", newPassword, { shouldValidate: true });
    toast({ title: "Password Generated", description: "A new strong password has been generated and filled in." });
  };

  const handlePsnSubmit: SubmitHandler<SignUpStep1Values> = async (data) => {
    setIsVerifying(true);
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
    setIsVerifying(false);
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
    setIsSigningUp(true);
    await signup(psnForStep2, data.password);
    // On success, the parent page will redirect. No navigation logic needed here.
    // The context handles toasting errors.
    setIsSigningUp(false);
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
                  type="text" 
                  {...formStep1.register("psn")} 
                  onInput={handlePsnInput}
                  maxLength={8}
                  placeholder="e.g., 10004703" 
                />
                {formStep1.formState.errors.psn && <p className="text-sm text-destructive">{formStep1.formState.errors.psn.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                <div className="relative">
                  <Input 
                    id="password-signup" 
                    type={showPassword ? "text" : "password"} 
                    {...formStep2.register("password")} 
                    placeholder="••••••••" 
                    onKeyUp={checkCapsLock}
                    onKeyDown={checkCapsLock}
                    onClick={checkCapsLock}
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
                <PasswordStrength password={watchedPassword} onStrengthChange={setPasswordStrength} />
                {formStep2.formState.errors.password && <p className="text-sm text-destructive">{formStep2.formState.errors.password.message}</p>}
                 {isCapsLockOn && (
                  <Alert variant="default" className="mt-2 p-2 text-xs bg-yellow-50 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                      Caps Lock is ON.
                      </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword-signup">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword-signup" 
                    type={showConfirmPassword ? "text" : "password"} 
                    {...formStep2.register("confirmPassword")} 
                    placeholder="••••••••" 
                    onKeyUp={checkCapsLock} 
                    onKeyDown={checkCapsLock}
                    onClick={checkCapsLock}
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
                {formStep2.formState.errors.confirmPassword && <p className="text-sm text-destructive">{formStep2.formState.errors.confirmPassword.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSigningUp || !passwordStrength?.isValid}>
                {isSigningUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
