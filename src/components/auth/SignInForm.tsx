
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
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ScrollReveal from '@/components/common/ScrollReveal';

const signInSchema = z.object({
  psn: z.string() 
    .min(1, "PSN is required.")
    .max(8, "PSN must be 1 to 8 digits.")
    .regex(/^[0-9]+$/, "PSN must be a number."),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const handlePsnInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setValue("psn", numericValue.slice(0, 8), { shouldValidate: true });
  };
  
  const checkCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof event.getModifierState === 'function') {
      setIsCapsLockOn(event.getModifierState("CapsLock"));
    }
  };

  const handleGoogleSignIn = () => {
    // This would integrate with Firebase Google Sign-In Provider
    toast({
      title: "Google Sign-In (Placeholder)",
      description: "Google Sign-In with Firebase is not fully implemented in this prototype. Use PSN/Password.",
      duration: 7000,
    });
  };

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    setIsLoading(true);
    const success = await login(Number(data.psn), data.password);
    setIsLoading(false); // setLoading(false) is handled in AuthContext onAuthStateChanged, but for immediate button state
    if (success) {
      toast({ title: "Login Attempted", description: "Checking credentials... Redirecting if successful." });
      // Redirect is handled by AuthContext listener or ProtectedPage
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      router.push(redirectPath);
    } else {
      // Error toast is shown by login function in AuthContext
    }
  };

  return (
    <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
      <Card className="w-full max-w-md shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your PSN and password to access your L&T Helpdesk account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="psn">PSN (up to 8 digits)</Label>
              <Input 
                id="psn" 
                type="text" 
                {...register("psn")} 
                onInput={handlePsnInput} 
                maxLength={8} 
                placeholder="e.g., 10000001" 
              />
              {errors.psn && <p className="text-sm text-destructive">{errors.psn.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password-signin">Password</Label>
                <Link href="/auth/forgot-password" passHref tabIndex={-1}>
                  <Button variant="link" size="sm" className="text-xs p-0 h-auto">Forgot?</Button>
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password-signin" 
                  type={showPassword ? "text" : "password"} 
                  {...register("password")} 
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
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              {isCapsLockOn && (
                <Alert variant="default" className="mt-2 p-2 text-xs bg-yellow-50 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                    Caps Lock is ON.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.5 512 0 403.3 0 261.8S110.5 11.6 244 11.6c70.3 0 133.5 29.1 179.9 75.9L363.5 145.5C334.1 120.2 293.3 100.9 244 100.9c-66.8 0-123.2 46.3-140 107.5H244V261.8zM99.3 203.9C112.7 139.4 173.1 95.4 244 95.4c42.9 0 79.2 21.4 101.8 53.1l42.4-42.4C346.3 52.4 299.6 29.1 244 29.1 151.4 29.1 74.1 83.8 39.5 158.9l59.8 45z"></path>
            </svg>
            Sign in with Google (Placeholder)
          </Button>
        </CardContent>
        <CardFooter className="text-sm text-center block">
          <p>
            First time user?{' '}
            <Link href="/auth/signup" passHref>
              <Button variant="link" className="p-0 h-auto">Create Account</Button>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </ScrollReveal>
  );
}
