"use client";

import { useState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { addIssueComment } from '@/app/controllers/issue-detail-controller';
import { toast } from 'sonner';

interface AddCommentFormProps {
  issueId: string;
  onCommentAdded?: () => void;
}

export function AddCommentForm({ 
  issueId, 
  onCommentAdded 
}: AddCommentFormProps) {
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const formData = new FormData();
    formData.append('issueId', issueId);
    formData.append('content', comment);

    startTransition(async () => {
      try {
        await addIssueComment(formData);
        setComment('');
        toast.success('Comment added successfully');
        onCommentAdded?.();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to add comment');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isPending}
        className="min-h-[100px]"
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending || !comment.trim()}
        >
          {isPending ? 'Posting...' : 'Add Comment'}
        </Button>
      </div>
    </form>
  );
}
