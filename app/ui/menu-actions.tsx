"use client";

import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProjectModal } from "./edit-project-modal";
import { deleteProject } from "../controllers/project-controllers";
import { useToast } from "@/hooks/use-toast";

interface MenuActionsProps {
  id: string;
  name: string;
  description: string;
  isOwner: boolean;
}

export default function MenuActions({ id, name, description, isOwner }: MenuActionsProps) {
  const { toast } = useToast();
  const { data: session } = useSession();

  async function handleDelete() {
    if (!session?.user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to delete a project",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteProject(id, session.user.email);
      toast({
        title: "Project deleted successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete project",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
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
        {isOwner ? (
          <>
            <EditProjectModal
              id={id}
              initialName={name}
              initialDescription={description}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Project
              </DropdownMenuItem>
            </EditProjectModal>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Users className="mr-2 h-4 w-4" />
              Manage Members
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600" 
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Project
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Users className="mr-2 h-4 w-4" />
            View Members
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
