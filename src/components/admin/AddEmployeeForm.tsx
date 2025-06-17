"use client"

import React, { useState }from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { AddEmployeeFormData } from '@/types';
import { mockProjects } from '@/data/mockData'; // Assuming projects are available
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


const addEmployeeSchema = z.object({
  psn: z.string().length(8, "PSN must be exactly 8 characters (e.g., EMP0000X)"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  project: z.string().min(1, "Project selection is required"),
  role: z.string().min(2, "Role description is required (e.g., Engineer, Analyst)"),
  grade: z.string().min(1, "Grade is required (e.g., E1, M2)"),
});

export default function AddEmployeeForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<AddEmployeeFormData>({
    resolver: zodResolver(addEmployeeSchema),
  });

  const onSubmit: SubmitHandler<AddEmployeeFormData> = async (data) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("New Employee Data:", data);
    // In a real app, save to DB and update mockEmployees or refetch
    // mockEmployees.push({ ...data, role: 'Employee', ...getHRForProject(data.project) });
    setIsLoading(false);
    toast({ title: "Employee Added", description: `${data.name} (${data.psn}) has been added.` });
    router.push('/dashboard'); // Or an employee list page
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add New Employee</CardTitle>
        <CardDescription>Enter the details for the new employee.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="psn">PSN (8-digit ID)</Label>
              <Input id="psn" {...register("psn")} placeholder="EMPXXXXX" />
              {errors.psn && <p className="text-sm text-destructive">{errors.psn.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="Employee's Full Name" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Controller
              name="project"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.city})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.project && <p className="text-sm text-destructive">{errors.project.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="role">Role (Designation)</Label>
              <Input id="role" {...register("role")} placeholder="e.g., Software Engineer" />
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input id="grade" {...register("grade")} placeholder="e.g., E1, M2, S3" />
              {errors.grade && <p className="text-sm text-destructive">{errors.grade.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Employee
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
