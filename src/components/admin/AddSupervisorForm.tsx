
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
import type { AddSupervisorFormData, Project } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { getAllProjectsAction, addSupervisorAction } from '@/lib/actions';

const addSupervisorSchema = z.object({
  psn: z.string()
    .min(1, "PSN is required.")
    .max(8, "PSN must be 1 to 8 digits.")
    .regex(/^[0-9]+$/, "PSN must be a number."),
  name: z.string().min(3, "Name must be at least 3 characters"),
  businessEmail: z.string().email("Invalid email address"),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }).optional(),
  title: z.string().min(3, "Title (e.g., Site Incharge, Cluster Head) is required"),
  functionalRole: z.enum(['IS', 'NS', 'DH', 'IC Head']),
  branchProject: z.string().optional(), 
  cityAccess: z.array(z.string()).optional(),
  projectsHandledIds: z.array(z.string()).optional(),
});

export default function AddSupervisorForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [cities, setCities] = useState<string[]>([]);


  useEffect(() => {
    async function fetchData() {
      try {
        const projectsData = await getAllProjectsAction();
        setProjects(projectsData);
        const uniqueCities = Array.from(new Set(projectsData.map(p => p.city))).sort();
        setCities(uniqueCities);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load project data.", variant: "destructive" });
        console.error("Failed to fetch project data:", error);
      }
    }
    fetchData();
  }, [toast]);

  const { register, handleSubmit, control, setValue, getValues, watch, formState: { errors } } = useForm<AddSupervisorFormData>({
    resolver: zodResolver(addSupervisorSchema),
    defaultValues: {
        cityAccess: [],
        projectsHandledIds: [],
        branchProject: "NO_PROJECT_SELECTED" 
    }
  });

  const selectedFunctionalRole = watch("functionalRole");

  const handlePsnInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setValue("psn", numericValue.slice(0, 8), { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<AddSupervisorFormData> = async (data) => {
    setIsLoading(true);
    try {
        await addSupervisorAction(data);
        toast({ title: "Supervisor Added", description: `${data.name} (${data.psn}) has been added as ${data.title}.` });
        router.push('/dashboard');
    } catch (error) {
        console.error("Failed to add supervisor:", error);
        toast({ title: "Error", description: "Failed to add supervisor. The PSN might already exist.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const handleCityAccessSelection = (cityName: string) => {
    const currentCities = getValues("cityAccess") || [];
    const newCities = currentCities.includes(cityName)
      ? currentCities.filter(name => name !== cityName)
      : [...currentCities, cityName];
    setValue("cityAccess", newCities, { shouldValidate: true });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add New Supervisor</CardTitle>
        <CardDescription>Enter the details for the new supervisor staff member.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="psn-supervisor">PSN (up to 8 digits)</Label>
              <Input 
                id="psn-supervisor" 
                type="text" 
                {...register("psn")} 
                onInput={handlePsnInput}
                maxLength={8}
                placeholder="e.g., 20000001" 
              />
              {errors.psn && <p className="text-sm text-destructive">{errors.psn.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-supervisor">Full Name</Label>
              <Input id="name-supervisor" {...register("name")} placeholder="Supervisor's Full Name" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="businessEmail-supervisor">Business Email</Label>
                    <Input id="businessEmail-supervisor" type="email" {...register("businessEmail")} placeholder="supervisor.name@lnt.co" />
                    {errors.businessEmail && <p className="text-sm text-destructive">{errors.businessEmail.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth-supervisor">Date of Birth</Label>
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
              <Label htmlFor="title-supervisor">Title</Label>
              <Input id="title-supervisor" {...register("title")} placeholder="e.g., Site Incharge, Cluster Head" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="functionalRole-supervisor">Functional Role</Label>
                <Controller
                    name="functionalRole"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="functionalRole-supervisor"> <SelectValue placeholder="Select functional role" /> </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="IS">IS (Immediate Supervisor)</SelectItem>
                            <SelectItem value="NS">NS (Next Level Supervisor)</SelectItem>
                            <SelectItem value="DH">DH (Department Head)</SelectItem>
                            <SelectItem value="IC Head">IC Head (In-Charge Head)</SelectItem>
                        </SelectContent>
                        </Select>
                    )}
                />
                {errors.functionalRole && <p className="text-sm text-destructive">{errors.functionalRole.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branchProject-supervisor">Branch / Primary Project Affiliation (Optional)</Label>
            <Controller
                name="branchProject"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || "NO_PROJECT_SELECTED"}>
                    <SelectTrigger id="branchProject-supervisor"> <SelectValue placeholder="Select primary project if applicable" /> </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="NO_PROJECT_SELECTED">None</SelectItem>
                        {projects.map(p => ( <SelectItem key={p.id} value={p.id}>{p.name} ({p.city})</SelectItem> ))}
                    </SelectContent>
                    </Select>
                )}
            />
            {errors.branchProject && <p className="text-sm text-destructive">{errors.branchProject.message}</p>}
          </div>

          {(selectedFunctionalRole === 'DH' || selectedFunctionalRole === 'IC Head') && (
            <div className="space-y-2">
                <Label>City Access (for DH/IC Head)</Label>
                <div className="max-h-48 overflow-y-auto space-y-2 rounded-md border p-4">
                    {cities.map(city => (
                        <div key={city} className="flex items-center space-x-2">
                            <Checkbox
                            id={`city-${city}`}
                            checked={getValues("cityAccess")?.includes(city) || selectedFunctionalRole === 'IC Head'}
                            onCheckedChange={() => handleCityAccessSelection(city)}
                            disabled={selectedFunctionalRole === 'IC Head'}
                            />
                            <Label htmlFor={`city-${city}`} className="font-normal cursor-pointer"> {city} </Label>
                        </div>
                    ))}
                </div>
                {errors.cityAccess && <p className="text-sm text-destructive">{errors.cityAccess.message}</p>}
                {selectedFunctionalRole === 'IC Head' && <p className="text-xs text-muted-foreground mt-1">IC Head has access to all cities by default.</p>}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Supervisor
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
