"use client"

import React, { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { AddHrFormData } from '@/types';
import { mockProjects } from '@/data/mockData'; 
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const addHrSchema = z.object({
  psn: z.string().length(8, "PSN must be exactly 8 characters (e.g., HR00000X)"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  projectsHandled: z.array(z.string()).min(1, "At least one project must be selected"),
  priority: z.coerce.number().min(1).max(3).default(2), // 1-Head, 2-Second, 3-Third
  role: z.enum(['HR', 'Head HR']).default('HR'),
});

export default function AddHrForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<AddHrFormData>({
    resolver: zodResolver(addHrSchema),
    defaultValues: {
        projectsHandled: [],
        priority: 2,
        role: 'HR'
    }
  });

  const onSubmit: SubmitHandler<AddHrFormData> = async (data) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("New HR Data:", data);
    // In a real app, save to DB and update mockHRs or refetch
    // mockHRs.push({ ...data, role: data.priority === 1 ? 'Head HR' : 'HR', projectsHandled: mockProjects.filter(p => data.projectsHandled.includes(p.id)) });
    setIsLoading(false);
    toast({ title: "HR Added", description: `${data.name} (${data.psn}) has been added as ${data.role}.` });
    router.push('/dashboard'); // Or an HR list page
  };
  
  const handleProjectSelection = (projectId: string) => {
    const currentProjects = getValues("projectsHandled") || [];
    const newProjects = currentProjects.includes(projectId)
      ? currentProjects.filter(id => id !== projectId)
      : [...currentProjects, projectId];
    setValue("projectsHandled", newProjects, { shouldValidate: true });
  };


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add New HR Personnel</CardTitle>
        <CardDescription>Enter the details for the new HR staff member.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="psn-hr">PSN (8-digit ID)</Label>
              <Input id="psn-hr" {...register("psn")} placeholder="HRXXXXXX" />
              {errors.psn && <p className="text-sm text-destructive">{errors.psn.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-hr">Full Name</Label>
              <Input id="name-hr" {...register("name")} placeholder="HR Personnel's Full Name" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Projects Handled</Label>
            <div className="max-h-60 overflow-y-auto space-y-2 rounded-md border p-4">
                {mockProjects.map(p => (
                    <div key={p.id} className="flex items-center space-x-2">
                        <Checkbox
                        id={`project-${p.id}`}
                        checked={getValues("projectsHandled")?.includes(p.id)}
                        onCheckedChange={() => handleProjectSelection(p.id)}
                        />
                        <Label htmlFor={`project-${p.id}`} className="font-normal cursor-pointer">
                        {p.name} ({p.city})
                        </Label>
                    </div>
                ))}
            </div>
            {errors.projectsHandled && <p className="text-sm text-destructive">{errors.projectsHandled.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="role-hr">Role</Label>
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="role-hr">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Head HR">Head HR</SelectItem>
                        </SelectContent>
                        </Select>
                    )}
                />
                {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority-hr">Priority Tier</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={String(field.value)}>
                    <SelectTrigger id="priority-hr">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Head HR</SelectItem>
                      <SelectItem value="2">2 - Second Tier HR</SelectItem>
                      <SelectItem value="3">3 - Third Tier HR</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add HR Personnel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
