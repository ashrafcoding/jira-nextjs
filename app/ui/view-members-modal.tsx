"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProjectMembers } from "../controllers/project-controllers";

interface Member {
  id: string;
  name: string | null;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar_url?: string;
}

interface ViewMembersModalProps {
  projectId: string;
  children: React.ReactNode;
}

export function ViewMembersModal({ projectId, children }: ViewMembersModalProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchMembers() {
      if (!open) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getProjectMembers(projectId);
        if (mounted) {
          setMembers(data as Member[] || []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching members:', err);
        if (mounted) {
          setError('Failed to load project members');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchMembers();

    return () => {
      mounted = false;
    };
  }, [projectId, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Project Members</DialogTitle>
          <DialogDescription>
            View and manage project members and their roles.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[400px] overflow-y-auto py-4">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading members...</div>
          ) : error ? (
            <div className="text-center text-destructive">{error}</div>
          ) : members.length === 0 ? (
            <div className="text-center text-muted-foreground">No members found</div>
          ) : (
            members.map((member) => (
                <div key ={member.id}>
              <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar_url} alt={member.name || 'User'} />
                    <AvatarFallback>
                      {member.name?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {member.name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{member.email}</p>
                  </div>
                </div>
                <Badge 
                  variant={member.role === "owner" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {member.role}
                </Badge>
               </div> 
               <Separator />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}