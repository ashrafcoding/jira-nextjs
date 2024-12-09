import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IssueCardProps } from "@/lib/definitions";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
} as const;

const statusColors = {
  open: "bg-blue-500",
  in_progress: "bg-yellow-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
} as const;

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link href={`/dashboard/projects/${issue.project_id}/issues/${issue.id}`}>
    <Card className="w-full mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{issue.title}</h3>
          <p className="text-sm text-muted-foreground">
            Created {formatDistanceToNow(new Date(issue.created_at))} ago
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={priorityColors[issue.priority as keyof typeof priorityColors]}>
            {issue.priority}
          </Badge>
          <Badge className={statusColors[issue.status as keyof typeof statusColors]}>
            {issue.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{issue.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {issue.assignee && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Assignee</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`https://avatar.vercel.sh/${issue.assignee.email}`} />
                    <AvatarFallback>{issue.assignee.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{issue.assignee.name}</span>
                </div>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Reporter</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://avatar.vercel.sh/${issue.reporter?.email}`} />
                  <AvatarFallback>{issue.reporter?.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{issue?.reporter?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}