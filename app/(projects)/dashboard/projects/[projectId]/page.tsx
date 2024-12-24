import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProject } from "@/app/controllers/project-controllers";
import { getProjectIssues, getProjectIssueStats } from "@/app/controllers/issue-controllers";
import { getProjectSprints } from "@/app/controllers/sprint-controllers";
import { CreateIssueModal } from "@/app/ui/issue/create-issue-modal";
import { IssueStats } from "@/app/ui/issue/issue-stats";
import { IssueCard } from "@/app/ui/issue/issue-card";
import { SprintManagement } from "@/app/ui/sprint/sprint-management";
import { SprintList } from "@/app/ui/sprint/sprint-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprint } from "@/lib/definitions";
import { SeedSprintsButton } from "@/app/ui/sprint/seed-sprints-button";

type ProjectParams = Promise<{projectId: string}>
   
export default async function ProjectIssuesPage({ params }:{params: ProjectParams}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }
  const { projectId } = await params;

  const project = await getProject(projectId);
  const issues = await getProjectIssues(projectId);
  const stats = await getProjectIssueStats(projectId);
  const sprints = await getProjectSprints(projectId);

  return (
    <div className="space-y-6 p-6 container min-h-screen mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <SprintManagement projectId={projectId} />
          <CreateIssueModal projectId={projectId} />
        </div>
      </div>

      <IssueStats stats={stats} />

      <Tabs defaultValue="issues" className="w-full">
        <TabsList>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="sprints">Sprints</TabsTrigger>
        </TabsList>
        <TabsContent value="issues">
          <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Project Issues</h1>
            <div className="grid gap-4 lg:grid-cols-2">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="sprints">
          <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Project Sprints</h1>
              {sprints.length === 0 && <SeedSprintsButton projectId={projectId} />}
            </div>
            <SprintList sprints={sprints as Sprint[]} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}