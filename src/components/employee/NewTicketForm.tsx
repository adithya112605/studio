
"use client"

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { NewTicketFormData, TicketPriority, Ticket, Employee } from '@/types'; // Added Ticket, Employee
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { mockTickets, mockProjects } from '@/data/mockData'; // Import mockTickets for simulation
import { Controller } from 'react-hook-form';


const newTicketSchema = z.object({
  query: z.string().min(10, "Query must be at least 10 characters long."),
  hasFollowUp: z.boolean().default(false),
  followUpQuery: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
}).refine(data => !data.hasFollowUp || (data.hasFollowUp && data.followUpQuery && data.followUpQuery.length > 0), {
  message: "Follow-up query cannot be empty if checked.",
  path: ["followUpQuery"],
});

// Function to generate new Ticket IDs in the format #TKXXXXXXX
const generateTicketId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `#TK${result}`;
};

export default function NewTicketForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<NewTicketFormData>({
    resolver: zodResolver(newTicketSchema),
    defaultValues: {
      priority: 'Medium',
      hasFollowUp: false,
    }
  });

  const hasFollowUp = watch('hasFollowUp');

  const onSubmit: SubmitHandler<NewTicketFormData> = async (data) => {
    if (!user || user.role !== 'Employee') { // Ensure user is an Employee
      toast({ title: "Error", description: "You must be logged in as an Employee to submit a ticket.", variant: "destructive" });
      return;
    }
    const employeeUser = user as Employee; // Cast user to Employee

    setIsLoading(true);
    // Simulate API call to create ticket
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTicketId = generateTicketId();
    const employeeProject = employeeUser.project || mockProjects[0].id; // Fallback project
    
    // Find HR for the project
    const projectDetails = mockProjects.find(p => p.id === employeeProject);
    let hrPsnAssigned: string | undefined = undefined;
    if (projectDetails && projectDetails.assignedHRs.length > 0) {
      hrPsnAssigned = projectDetails.assignedHRs[0]; // Assign first HR for simplicity
    } else {
      // Fallback to Head HR if project or specific HR not found
      hrPsnAssigned = 'HR000000'; 
    }

    const newTicket: Ticket = {
      id: newTicketId,
      psn: employeeUser.psn,
      employeeName: employeeUser.name,
      query: data.query,
      followUpQuery: data.hasFollowUp ? data.followUpQuery : undefined,
      priority: data.priority,
      dateOfQuery: new Date().toISOString(),
      status: 'Open',
      project: employeeProject,
      hrPSNAssigned: hrPsnAssigned, // Assign HR based on project
    };
    
    mockTickets.push(newTicket); // Add to mock data for simulation
    console.log("New Ticket Data:", newTicket);
    
    setIsLoading(false);
    toast({ title: "Ticket Submitted!", description: `Your ticket ${newTicketId} has been successfully raised.` });
    router.push('/dashboard'); 
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Raise a New Ticket</CardTitle>
        <CardDescription>Describe your issue or request below. Our HR team will get back to you shortly.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="query">Query / Issue Description</Label>
            <Textarea id="query" {...register("query")} placeholder="Please describe your issue in detail..." rows={5} />
            {errors.query && <p className="text-sm text-destructive">{errors.query.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {(['Low', 'Medium', 'High', 'Urgent'] as TicketPriority[]).map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="hasFollowUp"
              control={control}
              render={({ field }) => (
                 <Checkbox id="hasFollowUp" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="hasFollowUp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Add a follow-up query?
            </Label>
          </div>

          {hasFollowUp && (
            <div className="space-y-2">
              <Label htmlFor="followUpQuery">Follow-up Query</Label>
              <Textarea id="followUpQuery" {...register("followUpQuery")} placeholder="Enter your follow-up details..." rows={3} />
              {errors.followUpQuery && <p className="text-sm text-destructive">{errors.followUpQuery.message}</p>}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Ticket
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
