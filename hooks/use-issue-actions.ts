import { useState } from 'react';
import { toast } from 'sonner';
import { Issue } from '@/lib/definitions';
import { editIssue, deleteIssue } from '@/app/controllers/issue-controllers';

export function useIssueActions() {
  const [isLoading, setIsLoading] = useState(false);

  const handleEditIssue = async (
    issueId: string, 
    data: {
      title?: string;
      description?: string;
      priority?: Issue['priority'];
      status?: Issue['status'];
      assigneeEmail?: string | null;
    }
  ) => {
    setIsLoading(true);
    try {
      // Create FormData to match server action signature
      const formData = new FormData();
      formData.append('issueId', issueId);
      
      // Append optional fields only if they exist
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.priority) formData.append('priority', data.priority);
      if (data.status) formData.append('status', data.status);
      if (data.assigneeEmail) formData.append('assigneeEmail', data.assigneeEmail);

      const updatedIssue = await editIssue(formData);

      toast.success('Issue updated successfully');
      return updatedIssue;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('issueId', issueId);

      const result = await deleteIssue(formData);

      if (result.success) {
        toast.success('Issue deleted successfully');
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editIssue: handleEditIssue,
    deleteIssue: handleDeleteIssue,
    isLoading
  };
}
