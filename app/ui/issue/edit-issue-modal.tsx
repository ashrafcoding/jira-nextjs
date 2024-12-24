"use client";

import { useState, useTransition, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {  IssueWithUsers } from '@/lib/definitions';
import { editIssue, deleteIssue } from '@/app/controllers/issue-controllers';
import { toast } from 'sonner';

const issueSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  assigneeEmail: z.string().email().optional().nullable(),
});

interface EditIssueModalProps {
  issue: IssueWithUsers;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIssueUpdated?: (updatedIssue: IssueWithUsers) => void;
  onIssueDeleted?: () => void;
}

export function EditIssueModal({ 
  issue, 
  open, 
  onOpenChange,
  onIssueUpdated,
  onIssueDeleted
}: EditIssueModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof issueSchema>>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: issue.title,
      description: issue.description || '',
      priority: issue.priority,
      status: issue.status,
      assigneeEmail: issue.assignee?.email || null,
    },
  });

  useEffect(() => {
    if (issue) {
      form.reset({
        title: issue.title,
        description: issue.description || '',
        priority: issue.priority,
        status: issue.status,
        assigneeEmail: issue.assignee?.email || null,
      });
    }
  }, [issue, form]);

  const handleSubmit = async (values: z.infer<typeof issueSchema>) => {
    setIsLoading(true);
    
    // Create FormData
    const formData = new FormData();
    formData.append('issueId', issue.id)
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('priority', values.priority || "medium");
    formData.append('status', values.status || "open");
    if(values.assigneeEmail) {
      formData.append('assigneeEmail', values.assigneeEmail);
    } 

    try {
      startTransition(async () => {
        try {
          const updatedIssue = await editIssue(formData);
          onIssueUpdated?.(updatedIssue);
          onOpenChange(false);
          toast.success('Issue updated successfully');
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to update issue');
        } finally {
          setIsLoading(false);
        }
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update issue');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this issue?')) return;

    setIsDeleting(true);
    
    const formData = new FormData();
    formData.append('issueId', issue.id);

    try {
      startTransition(async () => {
        try {
          const result = await deleteIssue(formData);
          
          if (result.success) {
            onIssueDeleted?.();
            onOpenChange(false);
            toast.success('Issue deleted successfully');
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to delete issue');
        } finally {
          setIsDeleting(false);
        }
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete issue');
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Issue</DialogTitle>
          <DialogDescription>
            Make changes to the issue. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Issue title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Issue description" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['low', 'medium', 'high', 'critical'].map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace('_', ' ').split(' ').map(
                            word => word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assigneeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Assignee email (optional)" 
                      {...field} 
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting || isPending}
              >
                {isDeleting ? 'Deleting...' : 'Delete Issue'}
              </Button>
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading || isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || isPending}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
