import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MenuActions from "./menu-actions";

type CardProps = React.ComponentProps<typeof Card>;

interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  is_owner: boolean;
  member_role: string;
}

interface ProjectCardProps extends CardProps {
  project: Project;
}

export default function ProjectCard({ className, project, ...props }: ProjectCardProps) {
  return (
    <Card className={cn("w-[280px]", className)} {...props}>
      <div className="flex justify-between p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="capitalize">{project.name}</CardTitle>
            <CardDescription className="mt-2">{project.description}</CardDescription>
          </div>
        </div>
        <MenuActions 
          id={project.id} 
          name={project.name} 
          description={project.description} 
          isOwner={project.is_owner} 
        />
      </div>
      <CardContent>
        <div className="space-y-4">
          <div className="flex h-5 items-center justify-around text-xs font-bold">
            <div>open 4/4</div>
            <Separator orientation="vertical" className="h-14" />
            <div>closed 1/4</div>
          </div>
          <div className="flex space-x-2">
            {project.is_owner && (
              <Badge variant="default">Owner</Badge>
            )}
            {!project.is_owner && project.member_role !== 'none' && (
              <Badge variant="secondary" className="capitalize">
                {project.member_role}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
