"use client";

import { MoreHorizontal, Pencil, Trash2} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateTeamModal } from "./new-team-modal";
import { Team } from "@/lib/definitions";
import { deleteTeam } from "@/app/controllers/users";



export default function TeamMenuAction({team }:{team: Team}) {
    const handleDelete = async(e: Event) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to remove this team?')) return;
        await deleteTeam(team.id);        
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <CreateTeamModal team={team}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename Team
              </DropdownMenuItem> 
              </CreateTeamModal>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Team
              </DropdownMenuItem> 
            </DropdownMenuContent>
        </DropdownMenu>
    );

}