
"use client"

import React, { useState, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { AddEmployeeFormData, Project, JobCode } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { getAllProjects, getAllJobCodes, getAllGrades, addEmployee } from '@/lib/queries';

const addEmployeeSchema = z.object({
  psn: z.string()
    .min(1, "PSN is required.")
    .max(8, "PSN must be 1 to 8 digits.")
    .regex(/^[0-9]+$/, "PSN must be a number."),
  name: z.string().min(3, "Name must be at least 3 characters"),
  businessEmail: z.string().email("Invalid email address"),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }).optional(),
  project: z.string().min(1, "Project selection is required"),
  jobCodeId: z.string().min(1, "Job Code selection is required"),
  grade: z.string().min(1, "Grade is required."),
  isPSN: z.string().optional().refine(val => !val || /^[0-9]+$/.test(val) && val.length <= 8, { message: "IS PSN must be up to 8 digits."}),
  nsPSN: z.string().optional().refine(val => !val || /^[0-9]+$/.test(val) && val.length <= 8, { message: "NS PSN must be up to 8 digits."}),
  dhPSN: z.string().optional().refine(val => !val || /^[0-9]+$/.test(val) && val.length <= 8, { message: "DH PSN must be up to 8 digits."}),
});

export default function AddEmployeeForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [jobCodes, setJobCodes] = useState<JobCode[]>([]);
  const [grades, setGrades] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [projectsData, jobCodesData, gradesData] = await Promise.all([
        getAllProjects(),
        getAllJobCodes(),
        getAllGrades(),
      ]);
      setProjects(projectsData);
      setJobCodes(jobCodesData);
      setGrades(gradesData);
    }
    fetchData();
  }, []);

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<AddEmployeeFormData>({
    resolver: zodResolver(addEmployeeSchema),
  });
  
  const handleNumericInput = (fieldName: "psn" | "isPSN" | "nsPSN" | "dhPSN", event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setValue(fieldName, numericValue.slice(0, 8), { shouldValidate: true });
  };


  const onSubmit: SubmitHandler<AddEmployeeFormData> = async (data) => {
    setIsLoading(true);
    try {
      await addEmployee(data);
      toast({ title: "Employee Added", description: `${data.name} (${data.psn}) has been added.` });
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to add employee:", error);
      toast({ title: "Error", description: "Failed to add employee. The PSN might already exist.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add New Employee</CardTitle>
        <CardDescription>Enter the details for the new employee.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="psn">PSN (up to 8 digits)</Label>
              <Input 
                id="psn" 
                type="text" 
                {...register("psn")} 
                onInput={(e) => handleNumericInput("psn", e as React.ChangeEvent<HTMLInputElement>)}
                maxLength={8}
                placeholder="e.g., 10000001" 
              />
              {errors.psn && <p className="text-sm text-destructive">{errors.psn.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="Employee's Full Name" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input id="businessEmail" type="email" {...register("businessEmail")} placeholder="employee.name@lnt.co" />
                {errors.businessEmail && <p className="text-sm text-destructive">{errors.businessEmail.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1950}
                        toYear={new Date().getFullYear() - 18} 
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Controller
                name="project"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="project"><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name} ({p.city})</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.project && <p className="text-sm text-destructive">{errors.project.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade (Pay Level)</Label>
              <Controller
                name="grade"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="grade"><SelectValue placeholder="Select grade (e.g., M1-A)" /></SelectTrigger>
                    <SelectContent>
                      {grades.map(g => (<SelectItem key={g} value={g}>{g}</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.grade && <p className="text-sm text-destructive">{errors.grade.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
              <Label htmlFor="jobCodeId">Job Code (Title/Function)</Label>
              <Controller
                name="jobCodeId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="jobCodeId"><SelectValue placeholder="Select job code/title" /></SelectTrigger>
                    <SelectContent>
                      {jobCodes.map(jc => (<SelectItem key={jc.id} value={jc.id}>{jc.code} - {jc.description}</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.jobCodeId && <p className="text-sm text-destructive">{errors.jobCodeId.message}</p>}
          </div>

          <h3 className="text-lg font-semibold pt-4 border-t mt-6">Assign Supervisors</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="isPSN">Immediate Supervisor (IS) PSN</Label>
              <Input 
                id="isPSN" 
                type="text" 
                {...register("isPSN")} 
                onInput={(e) => handleNumericInput("isPSN", e as React.ChangeEvent<HTMLInputElement>)}
                maxLength={8}
                placeholder="IS PSN (Optional)" 
              />
              {errors.isPSN && <p className="text-sm text-destructive">{errors.isPSN.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nsPSN">Next Level Supervisor (NS) PSN</Label>
              <Input 
                id="nsPSN" 
                type="text" 
                {...register("nsPSN")} 
                onInput={(e) => handleNumericInput("nsPSN", e as React.ChangeEvent<HTMLInputElement>)}
                maxLength={8}
                placeholder="NS PSN (Optional)" 
              />
              {errors.nsPSN && <p className="text-sm text-destructive">{errors.nsPSN.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dhPSN">Department Head (DH) PSN</Label>
              <Input 
                id="dhPSN" 
                type="text" 
                {...register("dhPSN")}
                onInput={(e) => handleNumericInput("dhPSN", e as React.ChangeEvent<HTMLInputElement>)}
                maxLength={8} 
                placeholder="DH PSN (Optional)" 
              />
              {errors.dhPSN && <p className="text-sm text-destructive">{errors.dhPSN.message}</p>}
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
