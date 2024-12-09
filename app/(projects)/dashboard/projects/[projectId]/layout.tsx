import { ProjectNav } from "@/app/ui/project/project-nav";
import { getProject } from "@/app/controllers/project-controllers";
import { Project } from "@/lib/definitions";

// project layout
export const metadata = {
    title: 'Projects',
    description: 'Projects',
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }> ;
}) {
    const { projectId } = await params;
  const project = await getProject(projectId) as Project;

  return (
    <div className="flex h-screen bg-background">
      <ProjectNav project={project} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}