import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getUserProjects } from "@/app/controllers/project-controllers";
import ProjectCard from "@/app/ui/project-card";
import { CreateProjectModal } from "@/app/ui/create-project-modal";
import { ProjectFilters } from "@/app/ui/project-filters";

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

interface PageProps {
  searchParams: { filter?: string }
}

export default async function HomePage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const {filter} = await searchParams || 'all';

  const projects = await getUserProjects(session.user.email) as Project[];

  // Filter projects on the server side
  const filteredProjects = filter === 'all' 
    ? projects 
    : filter === 'owned'
      ? projects.filter(project => project.is_owner)
      : projects.filter(project => !project.is_owner);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <p>-------- projects</p>
          <hr className="my-2"/>
          <h1 className="text-3xl font-bold tracking-tight my-2">Multi tasking is hard. Focus is good.</h1>
          <h2>Name your projects the way your teams recognize it.</h2>
        </div>
        <div>
          <Image
            alt="bugs"
            src="/bugs.svg"
            width={600}
            height={300}
          />
        </div>
      </div>

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <div className="flex items-center space-x-2">
          <ProjectFilters />
          <CreateProjectModal />
        </div>
      </div>

      <div className="flex-1 space-y-4 pt-4">
        <div className="grid gap-4 md:grid-cols-2 sm:justify-items-center lg:grid-cols-3 xl:grid-cols-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              className="w-full"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
