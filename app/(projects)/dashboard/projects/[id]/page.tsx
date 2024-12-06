import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProject } from "@/app/controllers/project-controllers";
import { getProjectIssues, getProjectIssueStats } from "@/app/controllers/issue-controllers";
import { getProjectSprints } from "@/app/controllers/sprint-controllers";
import { CreateIssueModal } from "@/app/ui/create-issue-modal";
import { IssueStats } from "@/app/ui/issue-stats";
import { IssueCard } from "@/app/ui/issue-card";
import { SprintManagement } from "@/app/ui/sprint-management";
import { SprintList } from "@/app/ui/sprint-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprint } from "@/lib/definitions";
import { SeedSprintsButton } from "@/app/ui/seed-sprints-button";

type ProjectParams = Promise<{id: string}>
   
export default async function ProjectIssuesPage({ params }:{params: ProjectParams}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }
  const { id } = await params;

  const project = await getProject(id);
  const issues = await getProjectIssues(id);
  const stats = await getProjectIssueStats(id);
  const sprints = await getProjectSprints(id);

  return (
    <div className="space-y-6 p-6 container mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <SprintManagement projectId={id} />
          <CreateIssueModal projectId={id} />
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
              {sprints.length === 0 && <SeedSprintsButton projectId={id} />}
            </div>
            <SprintList sprints={sprints as Sprint[]} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}