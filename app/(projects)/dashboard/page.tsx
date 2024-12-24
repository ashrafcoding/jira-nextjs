import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getUserProjects } from "@/app/controllers/project-controllers";
import ProjectCard from "@/app/ui/project/project-card";
import { CreateProjectModal } from "@/app/ui/project/create-project-modal";
import { ProjectFilters } from "@/app/ui/project/project-filters";

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

type sParams = Promise<{
  filter?: string;
  search?: string;  
}>;

export default async function HomePage({ searchParams }: {searchParams: sParams}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { filter = 'all', search = '' } = await searchParams;

  const projects = await getUserProjects(session.user.email) as Project[];

  // Filter projects on the server side
  let filteredProjects = filter === 'all'
    ? projects
    : filter === 'owned'
      ? projects.filter(project => project.is_owner)
      : projects.filter(project => !project.is_owner);

  // Apply search filter if search term exists
  if (search) {
    filteredProjects = filteredProjects.filter(project =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <main className="flex container min-h-screen m-auto flex-col py-10 px-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <p>-------- projects</p>
          <hr className="my-2" />
          <h1 className="text-3xl font-bold tracking-tight my-2">Multi tasking is hard. Focus is good.</h1>
          <h2>Name your projects the way your teams recognize it.</h2>
        </div>
        <div className="hidden  md:block">
          <Image
            priority
            alt="bugs"
            src="/bugs.svg"
            width={600}
            height={300}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-6">
        <ProjectFilters />
        <CreateProjectModal />
      </div>

      <div className=" space-y-4 pt-4">
        <div className=" grid gap-4 auto-rows-fr grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
