import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
// import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import TeamMenuAction from "./team-menu-action";
import { auth } from "@/auth";
import { Team } from "@/lib/definitions";
import { getTeamMembers } from "@/app/controllers/users";
import Link from "next/link";



type CardProps = React.ComponentProps<typeof Card>;

interface TeamCardProps extends CardProps {
    team: Team;
}


export default async function TeamCard({ className, team, ...props }: TeamCardProps) {
   

    const session = await auth();
    const email = session?.user?.email;
    const members = await getTeamMembers(team.id);

    return (

        <Card className={cn("min-w-[240px] max-w-lg", className)} {...props}>
            <div className="flex justify-between p-6">
                <div className="">
                    <h2>{team.name}</h2>
                </div>
                <TeamMenuAction team={team} />
            </div>
            <Link href={`/team/${team.id}`}>
            <CardContent className="flex flex-col items-center">
                <Avatar className="self-center m-2">
                    <AvatarImage src={"/avatar2.png"} alt="avatar" />
                </Avatar>
                <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <p>{email}</p>
                </div>
                <Separator className="my-4" />
                <div className="">
                    <p>Total Members: {members?.length}</p>
                </div>
            </CardContent>
            </Link>
        </Card>
    );
}
