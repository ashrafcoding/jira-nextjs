import { getTeams } from "@/app/controllers/users";
import { CreateTeamModal } from "@/app/ui/team/new-team-modal";
import TeamCard from "@/app/ui/team/team-card";
import { auth } from "@/auth";
import { Team } from "@/lib/definitions";
import Image from "next/image";

export default async function TeamPage() {
  const session = await auth();
  const email = session?.user?.email;
  const teams = await getTeams(email as string) as Team[];  
  return (
    <main className="min-h-screen m-auto p-8">
      <div className="flex justify-between gap-4">
        <div className="mb-4  py-6">
            <h1 className="text-3xl font-bold">Team Work</h1>
            <hr className="my-2" />
            <p className="text-sm py-4">Collaborate, raise, track and move your issues to closure by working as a team.</p>
            <CreateTeamModal />
        </div>
        <div className="hidden  md:block">
        <Image
        className="w-full"
            src="/team.svg"
            alt="Team"
            width={400}
            height={200}
        />
        </div>
        </div>
        <div className=" space-y-4 pt-4">
        <div className=" grid gap-4 auto-rows-fr grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {teams && teams.map((team) => (
            <TeamCard key={team.id} team={team}  />
          ))}
        </div>
      </div>
    </main>
  )
}