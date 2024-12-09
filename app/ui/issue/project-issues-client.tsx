"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Edit2, 
  MoreHorizontal, 
  // PlusCircle 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { EditIssueModal } from '@/app/ui/issue/edit-issue-modal';
import { IssueWithUsers } from '@/lib/definitions';
import { CreateIssueModal } from '@/app/ui/issue/create-issue-modal';

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

export default function ProjectIssuesClient({ 
  issues: initialIssues ,
  projectId
}: { 
  issues: IssueWithUsers[] ,
  projectId: string
}) {
  const [issues, setIssues] = useState(initialIssues);
  const [selectedIssue, setSelectedIssue] = useState<IssueWithUsers | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditIssue = (issue: IssueWithUsers) => {
    setSelectedIssue(issue);
    setIsEditModalOpen(true);
  };

  const handleIssueUpdated = (updatedIssue: IssueWithUsers) => {
    setIssues(currentIssues => 
      currentIssues.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      )
    );
  };

  const handleIssueDeleted = () => {
    if (selectedIssue) {
      setIssues(currentIssues => 
        currentIssues.filter(issue => issue.id !== selectedIssue.id)
      );
      setSelectedIssue(null);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Issues</CardTitle>
          <CreateIssueModal projectId={projectId} />
          {/* <Button size="sm" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Issue
          </Button> */}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>{issue.title}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(issue.status)}>
                      {issue.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {issue.assignee?.name || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem 
                          onClick={() => handleEditIssue(issue)}
                        >
                          <Edit2 className="mr-2 h-4 w-4" /> Edit Issue
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedIssue && (
        <EditIssueModal 
          issue={selectedIssue}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onIssueUpdated={handleIssueUpdated}
          onIssueDeleted={handleIssueDeleted}
        />
      )}
    </div>
  );
}