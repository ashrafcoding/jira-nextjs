"use client";

import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProjectModal } from "./edit-project-modal";
import DeleteAlert from "./delete-alert";
import { ViewMembersModal } from "./view-members-modal";


interface MenuActionsProps {
  id: string;
  name: string;
  description: string;
  isOwner: boolean;
}

export default function MenuActions({ id, name, description, isOwner }: MenuActionsProps) {
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
            <ViewMembersModal projectId={id}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Users className="mr-2 h-4 w-4" />
                View Members
              </DropdownMenuItem>
            </ViewMembersModal>
            <DropdownMenuSeparator />
            <DeleteAlert id={id}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DeleteAlert>
          </>
        ) : (
          <ViewMembersModal projectId={id}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Users className="mr-2 h-4 w-4" />
              View Members
            </DropdownMenuItem>
          </ViewMembersModal>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
