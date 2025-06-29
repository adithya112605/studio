
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
import { Loader2, Eye, EyeOff } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import { useRouter } from 'next/navigation';

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
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, control } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      psn: '',
      password: '',
    },
  });

  const handlePsnInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setValue("psn", numericValue.slice(0, 8), { shouldValidate: true });
  };
  
  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    const result = await login(Number(data.psn), data.password);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  const onPasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <ScrollReveal animationInClass="animate-fadeInUp" once={false}>
      <Card className="w-full max-w-md shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your PSN and password. For a demo, use 
            PSN <code className="font-bold text-primary bg-muted px-1 py-0.5 rounded">10004703</code> with password <code className="font-bold text-primary bg-muted px-1 py-0.5 rounded">password</code>.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="psn">PSN (up to 8 digits)</Label>
              <Input
                id="psn"
                autoComplete="username"
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
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      id="password-signin"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      onKeyDown={onPasswordKeyDown}
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
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
             <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <p className="text-sm">
              First time user?{' '}
              <Link href="/auth/signup" passHref>
                <Button variant="link" className="p-0 h-auto">Create Account</Button>
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </ScrollReveal>
  );
}
