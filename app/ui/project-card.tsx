import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import MenuActions from "./menu-actions";
import {  getProjectIssueStats } from "@/app/controllers/issue-controllers";
import Link from "next/link";
import { UploadProjectAvatar } from "./upload-project-avatar";


type CardProps = React.ComponentProps<typeof Card>;

interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  is_owner: boolean;
  member_role: string;
}

interface ProjectCardProps extends CardProps {
  project: Project;
}

export default async function ProjectCard({ className, project, ...props }: ProjectCardProps) {
  // Fetch issue statistics for this project
  const stats = await getProjectIssueStats(project.id);
  
  return (
    
      <Card className={cn("min-w-[280px] ", className)} {...props}>
        <div className="flex justify-between p-6">
        
          <div className="flex items-start gap-4">
          <UploadProjectAvatar projectId={project.id} currentAvatar={project.avatar_url||"./bug.png"} />

            <Link href={`/dashboard/projects/${project.id}`}>
            <div>
              <CardTitle className="capitalize">{project.name}</CardTitle>
              <CardDescription className="mt-2">{project.description}</CardDescription>
              <Separator className="mt-4" />
            </div>
            </Link>
          </div>
          
          <MenuActions 
            id={project.id} 
            name={project.name} 
            description={project.description} 
            isOwner={project.is_owner} 
          />
        </div>
        <CardContent>
          <div className="flex items-center justify-between space-x-4">
            {project.is_owner && (
              <Badge variant="default">Owner</Badge>
            )}
            {!project.is_owner && project.member_role !== 'none' && (
              <Badge variant="secondary" className="capitalize">
                {project.member_role}
              </Badge>
            )}
          </div>
          <div className="flex h-5 items-center justify-around text-xs font-medium mt-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Open {stats.open}/{stats.total}</span>
            </div>
            <div className="h-10 flex items-center">
              <Separator orientation="vertical" className="h-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-500" />
              <span>Closed {stats.closed}/{stats.total}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            {project.is_owner && (
              <Badge variant="outline" className="mt-2">
                Project Admin
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
  );
}
