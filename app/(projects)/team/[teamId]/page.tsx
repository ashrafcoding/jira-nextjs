import { getTeam } from "@/app/controllers/users";
import Image from "next/image";
import { Team } from "@/lib/definitions";
import { InviteMemberModal } from "@/app/ui/team/invite-member-modal";
import InviteCard from "@/app/ui/team/invite-card";

type Params = Promise<{ teamId: string }>;
export default async function Page({ params }: { params: Params }) {
  const { teamId } = await params;
  const team = await getTeam(teamId);
  return (
    <main className="min-h-screen m-auto p-8">
      <div className="flex justify-between gap-4">
        <div className="mb-4  py-6">
          <h1 className="text-3xl font-bold">{team?.name}</h1>
          <hr className="my-2" />
          <p className="text-sm py-4">
            We work in teams. Bring your teams together and collaborate or even
            work on private projects.
          </p>
          <InviteMemberModal team={team as Team}/>
        </div>
        <div className="hidden  md:block">
          <Image
            className="w-full"
            src="/teamMembers.svg"
            alt="Team"
            width={400}
            height={200}
          />
        </div>
      </div>
      <div className=" space-y-4 pt-4">
              <InviteCard team={team as Team} />
      </div>
    </main>
  );
}
