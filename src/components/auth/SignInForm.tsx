
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
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const signInSchema = z.object({
  psn: z.coerce.number().int().positive("PSN must be a positive number.").refine(val => val.toString().length > 0 && val.toString().length <= 8, { message: "PSN must be a number with 1 to 8 digits." }),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    setIsLoading(true);
    const success = await login(data.psn, data.password);
    setIsLoading(false);
    if (success) {
      toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
      const roleRedirect = searchParams.get('role'); // e.g. for HR portal link
      if (roleRedirect === 'hr') {
        // Further check if user is actually HR after login if needed
        router.push('/dashboard'); // Or specific HR dashboard
      } else {
        router.push('/dashboard');
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid PSN or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
        <CardDescription>Enter your PSN and password to access your L&T Helpdesk account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="psn">PSN (up to 8 digits)</Label>
            <Input id="psn" type="number" {...register("psn")} placeholder="e.g., 10000001" />
            {errors.psn && <p className="text-sm text-destructive">{errors.psn.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} placeholder="••••••••" />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm">
        <Link href="/auth/forgot-password" passHref>
          <Button variant="link" className="p-0 h-auto">Forgot Password?</Button>
        </Link>
        <p>
          First time user?{' '}
          <Link href="/auth/signup" passHref>
             <Button variant="link" className="p-0 h-auto">Create Account</Button>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
