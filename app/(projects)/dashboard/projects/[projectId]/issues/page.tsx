import { getProjectIssues } from '@/app/controllers/issue-controllers';
import ProjectIssuesClient from '../../../../../ui/issue/project-issues-client';

type Params = Promise<{ projectId: string }>;
export const dynamic = 'force-dynamic';

export default async function ProjectIssuesPage({ 
  params 
}: { 
  params: Params 
}) {
  const { projectId } = await params;
  const issues = await getProjectIssues(projectId);

  return <ProjectIssuesClient issues={issues} projectId={projectId} />;
}