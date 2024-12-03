import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProject } from "@/app/controllers/project-controllers";
import { getProjectIssues } from "@/app/controllers/issue-controllers";
import { CreateIssueModal } from "@/app/ui/create-issue-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDot, Clock, CheckCircle2, XCircle } from "lucide-react";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/login");
  }
  const id = (await params).id;

  const project = await getProject(id);
  const issues = await getProjectIssues(id);

  // Calculate issue statistics
  const issueStats = {
    open: issues.filter(issue => issue.status === 'open').length,
    in_progress: issues.filter(issue => issue.status === 'in_progress').length,
    resolved: issues.filter(issue => issue.status === 'resolved').length,
    closed: issues.filter(issue => issue.status === 'closed').length,
    total: issues.length
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <CreateIssueModal projectId={id} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <CircleDot className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issueStats.open}</div>
            <p className="text-xs text-muted-foreground">
              {((issueStats.open / issueStats.total) * 100).toFixed(1)}% of total issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issueStats.in_progress}</div>
            <p className="text-xs text-muted-foreground">
              {((issueStats.in_progress / issueStats.total) * 100).toFixed(1)}% of total issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issueStats.resolved}</div>
            <p className="text-xs text-muted-foreground">
              {((issueStats.resolved / issueStats.total) * 100).toFixed(1)}% of total issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <XCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issueStats.closed}</div>
            <p className="text-xs text-muted-foreground">
              {((issueStats.closed / issueStats.total) * 100).toFixed(1)}% of total issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Issue list will be added here */}
    </div>
  );
}