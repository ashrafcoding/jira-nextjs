import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {AddCommentForm} from '@/app/ui/add-comment-form';

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  User, 
  Tag, 
  AlertCircle 
} from 'lucide-react';
// import { EditIssueModal } from '@/components/edit-issue-modal';
import { getIssueDetails, getIssueComments } from '@/app/controllers/issue-detail-controller';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';

function getPriorityBadgeVariant(priority: string) {
  switch (priority) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'secondary';
    case 'medium':
      return 'outline';
    default:
      return 'default';
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'closed':
      return 'secondary';
    case 'resolved':
      return 'default';
    case 'in_progress':
      return 'outline';
    default:
      return 'default';
  }
}

async function IssueDetailsContent({ issueId }: { issueId: string }) {
  const formData = new FormData();
  formData.append('issueId', issueId);

  const issue = await getIssueDetails(formData);
  const comments = await getIssueComments(formData);

  if (!issue) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{issue.title}</CardTitle>
            <CardDescription>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>
                  Created by {issue.reporter?.name || 'Unknown'} 
                  {' '}
                  {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {issue.description || 'No description provided'}
            </p>
          </CardContent>
        </Card>

        {/* Comments Section */}
        
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {comments.length === 0 ? (
              <p className="text-muted-foreground">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="mb-4 pb-4 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{comment.author_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span>Priority</span>
              </div>
              <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                {issue.priority}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <span>Status</span>
              </div>
              <Badge variant={getStatusBadgeVariant(issue.status)}>
                {issue.status.replace('_', ' ')}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Assignee</span>
              </div>
              <span>
                {issue.assignee?.name || 'Unassigned'}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Last Updated</span>
              </div>
              <span>
                {formatDistanceToNow(new Date(issue.updated_at), { addSuffix: true })}
              </span>
            </div>
          </CardContent>
        </Card>
        <AddCommentForm issueId={issueId} />
      </div>
    </div>
  );
}

type Params = Promise<{issueId: string}>;
export default async function IssuePage({ 
  params 
}: { 
  params: Params
}) {
  const {issueId} = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading issue details...</div>}>
        <IssueDetailsContent issueId={issueId} />
      </Suspense>
    </div>
  );
}
