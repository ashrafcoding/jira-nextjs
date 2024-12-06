import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getUserProjects } from "@/app/controllers/project-controllers";
import ProjectCard from "@/app/ui/project-card";
import { CreateProjectModal } from "@/app/ui/create-project-modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";



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

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const projects = await getUserProjects(session.user.email);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <div className="flex items-center space-x-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter</SelectLabel>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="owned">Owned Projects</SelectItem>
                <SelectItem value="member">Member Projects</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <CreateProjectModal />
        </div>
      </div>

      
      
      
      <div className="flex-1 space-y-4 pt-4">
        <div className="grid gap-4 md:grid-cols-2 sm:justify-items-center lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project as Project} 
            className="w-full"
          />
          ))}
        </div>
      </div>

    </main>
  );
}
