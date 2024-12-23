import { getProjectSprints } from "@/app/controllers/sprint-controllers";
import {SprintList} from "@/app/ui/sprint/sprint-list";
import  {Sprint} from "@/lib/definitions";

type ProjectParams = Promise<{projectId: string}>

export default async function SprintsPage({ params }:{params: ProjectParams}) {
    const { projectId } = await params;

    const sprints = await getProjectSprints(projectId);
  return (
    <div className="space-y-6 p-6 container mx-auto">
        <h1 className="text-2xl font-bold tracking-tight">Sprint list</h1>
        <SprintList sprints={sprints as Sprint[]} />
        </div>
  )
}