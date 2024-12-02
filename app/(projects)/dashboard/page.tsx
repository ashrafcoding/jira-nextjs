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

  const projects = (await getUserProjects(session.user.email)) as Project[];
  
  return (
    <div>
      <div className="flex items-center justify-between space-y-2 px-8 py-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your projects and projects you&apos;re a member of
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Image
            src="/multitask3.jpg"
            alt="Multitask"
            width={200}
            height={200}
            priority
            className="hidden md:block"
          />
        </div>
      </div>
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex gap-4">
          <div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a filter" />
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
          </div>
          <div>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort by</SelectLabel>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Project Name</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <SlidersHorizontal className="h-4 w-4" />
          <CreateProjectModal />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}
