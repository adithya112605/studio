
"use client"

import React, { useState, useRef } from 'react';
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
import { Loader2, Paperclip } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createTicket, getSupervisorByPsn } from '@/lib/queries';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

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

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setAttachedFiles(prev => [...prev, ...newFiles]); 
      newFiles.forEach(file => {
        toast({
            title: "File Added (Mock)",
            description: `"${file.name}" is ready to be attached.`,
        });
      });
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  
  const removeAttachment = (fileName: string) => {
    setAttachedFiles(prev => prev.filter(file => file.name !== fileName));
    toast({
        title: "File Removed",
        description: `"${fileName}" has been removed from attachments.`,
        variant: "default"
    })
  };

  const onSubmit: SubmitHandler<NewTicketFormData> = async (data) => {
    if (!user || user.role !== 'Employee') {
      toast({ title: "Error", description: "You must be logged in as an Employee to submit a ticket.", variant: "destructive" });
      return;
    }
    const employeeUser = user as Employee;

    setIsLoading(true);

    const newTicketData: Omit<Ticket, 'id'> = {
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
        const newTicketId = await createTicket(newTicketData, attachedFiles);

        if (employeeUser.isPSN) {
          const isSupervisor = await getSupervisorByPsn(employeeUser.isPSN);
          if (isSupervisor) {
            console.log(`Notification: New ticket ${newTicketId} assigned to IS ${isSupervisor.name}`);
            toast({ title: "IS Notified (Simulated)", description: `Supervisor ${isSupervisor.name} has been notified about your new ticket.`});
          }
        }
        
        toast({ title: "Ticket Submitted!", description: `Your ticket ${newTicketId} has been successfully raised.` });
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
            <Button type="button" variant="outline" onClick={handleAttachmentClick} className="w-full justify-start text-left" data-ai-hint="file upload document image video audio link">
                <Paperclip className="mr-2 h-4 w-4" /> Add Attachments
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            />
            {attachedFiles.length > 0 && (
                <div className="mt-2 space-y-1 text-xs">
                    <p className="font-medium text-muted-foreground">Selected files:</p>
                    <ul className="list-disc list-inside pl-4">
                        {attachedFiles.map(file => (
                            <li key={file.name} className="flex items-center justify-between">
                                <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                                <Button type="button" variant="ghost" size="sm" className="text-destructive h-auto p-1" onClick={() => removeAttachment(file.name)}>Remove</Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <p className="text-xs text-muted-foreground">You can attach documents, images, videos, audio, or share links.</p>
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
