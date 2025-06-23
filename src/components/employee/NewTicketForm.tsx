
"use client"

import React, { useState } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { NewTicketFormData, TicketPriority, Ticket, Employee, TicketStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createTicketAction } from '@/lib/actions';

const MAX_QUERY_LENGTH = 1500;

const newTicketSchema = z.object({
  query: z.string()
    .min(10, "Query must be at least 10 characters long.")
    .max(MAX_QUERY_LENGTH, `Query must not exceed ${MAX_QUERY_LENGTH} characters.`),
  hasFollowUp: z.boolean().default(false),
  followUpQuery: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
}).refine(data => !data.hasFollowUp || (data.hasFollowUp && data.followUpQuery && data.followUpQuery.length > 0), {
  message: "Follow-up query cannot be empty if checked.",
  path: ["followUpQuery"],
});


export default function NewTicketForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [queryCharCount, setQueryCharCount] = useState(0);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<NewTicketFormData>({
    resolver: zodResolver(newTicketSchema),
    defaultValues: {
      priority: 'Medium',
      hasFollowUp: false,
    }
  });

  const hasFollowUp = watch('hasFollowUp');
  const queryValue = watch('query');

  React.useEffect(() => {
    setQueryCharCount(queryValue?.length || 0);
  }, [queryValue]);


  const onSubmit: SubmitHandler<NewTicketFormData> = async (data) => {
    if (!user || user.role !== 'Employee') {
      toast({ title: "Error", description: "You must be logged in as an Employee to submit a ticket.", variant: "destructive" });
      return;
    }
    const employeeUser = user as Employee;

    setIsLoading(true);

    const newTicketData: Omit<Ticket, 'id' | 'attachments'> = {
      psn: employeeUser.psn,
      employeeName: employeeUser.name,
      query: data.query,
      followUpQuery: data.hasFollowUp ? data.followUpQuery : undefined,
      priority: data.priority,
      dateOfQuery: new Date().toISOString(),
      status: 'Open' as TicketStatus,
      project: employeeUser.project,
      currentAssigneePSN: employeeUser.isPSN,
      lastStatusUpdateDate: new Date().toISOString(),
    };
    
    try {
        const { ticketId, supervisorName } = await createTicketAction(newTicketData);

        if (supervisorName) {
            toast({ title: "IS Notified (Simulated)", description: `Supervisor ${supervisorName} has been notified about your new ticket.`});
        }
        
        toast({ title: "Ticket Submitted!", description: `Your ticket ${ticketId} has been successfully raised.` });
        router.push('/dashboard');

    } catch (error) {
        console.error("Failed to create ticket:", error);
        toast({ title: "Error", description: "Failed to submit your ticket. Please try again.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Raise a New Ticket</CardTitle>
        <CardDescription>Describe your issue or request below. Your Immediate Supervisor (IS) will be notified.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="query">Query / Issue Description</Label>
            <Textarea
              id="query"
              {...register("query")}
              placeholder="Please describe your issue in detail..."
              rows={5}
              maxLength={MAX_QUERY_LENGTH}
            />
            <div className="text-right text-xs text-muted-foreground">
              {queryCharCount}/{MAX_QUERY_LENGTH}
            </div>
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

           <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <Button type="button" variant="outline" className="w-full justify-start text-left" disabled>
                Add Attachments (Temporarily disabled)
            </Button>
            <p className="text-xs text-muted-foreground">The file attachment feature is currently undergoing maintenance.</p>
          </div>
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
