import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/auth";
import { Team } from "@/lib/definitions";
import { getTeamMembers } from "@/app/controllers/users";

type CardProps = React.ComponentProps<typeof Card>;

interface TeamCardProps extends CardProps {
    team: Team;
}

export default async function InviteCard({ className, team, ...props }: TeamCardProps) {
   

    const session = await auth();
    const email = session?.user?.email;
    const members = await getTeamMembers(team.id);

    return (

        <Card className={cn("min-w-[500px]", className)} {...props}>            
            <CardContent className="flex justify-between items-center p-4">
                <h2>{team.name}</h2>
                <Avatar className="self-center m-2">
                    <AvatarImage src={"/avatar2.png"} alt="avatar" />
                </Avatar>
                <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <p>{email}</p>
                </div>
                    <p>Total Members: {members?.length}</p>
            </CardContent>
        </Card>
    );
}
