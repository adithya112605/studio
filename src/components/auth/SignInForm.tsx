
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
import { Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // The login function now handles success (via onAuthStateChanged) and failure (by throwing an error).
      await login(Number(data.psn), data.password);
      // On success, the parent page will redirect. No navigation logic needed here.
    } catch (error) {
      // The context already shows a toast for the error.
      // We just need to stop the loading spinner.
      console.error("Sign-in attempt failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
      <Card className="w-full max-w-md shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your PSN and password. For a demo, use PSN <code className="font-bold text-primary">10004703</code> with password <code className="font-bold text-primary">password</code>.</CardDescription>
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
                placeholder="e.g., 10004703" 
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
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
