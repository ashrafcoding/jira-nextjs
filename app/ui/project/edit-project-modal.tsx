"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProject } from "@/app/controllers/project-controllers";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  addProjectMember, 
  getAllUsers, 
  getProjectMembers, 
  removeProjectMember,
  updateMemberRole 
} from "@/app/controllers/member-controllers";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Project name is required.",
  }),
  description: z.string().min(1, {
    message: "Project description is required.",
  }),
  newMember: z.string().optional(),
});

interface EditProjectModalProps {
  children: React.ReactNode;
  id: string;
  initialName: string;
  initialDescription: string;
}

interface Member {
  id: string;
  user_id: string;
  project_id: string;
  name: string;
  email: string;
  role: string;
  joined_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export function EditProjectModal({ children, id, initialName, initialDescription }: EditProjectModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
      description: initialDescription,
      newMember: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      const loadData = async () => {
        try {
          const [membersData, usersData] = await Promise.all([
            getProjectMembers(id),
            getAllUsers(),
          ]);
          setMembers(membersData as Member[] || []);
          setUsers(usersData as User[] || []);
        } catch (error) {
          console.error("Failed to load data:", error);
          toast({
            title: "Failed to load members",
            variant: "destructive",
          });
        }
      };
      loadData();
    }
  }, [id, open, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to edit a project",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await updateProject(id, values.name, values.description, session.user.email);
      setOpen(false);
      toast({
        title: "Project updated successfully",
      });
      form.reset();
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update project",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  const handleAddMember = async (email: string) => {
    try {
      await addProjectMember(id, email);
      const updatedMembers = await getProjectMembers(id);
      setMembers(updatedMembers as Member[] || []);
      toast({
        title: "Member added successfully",
      });
      form.setValue("newMember", undefined);
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to add member",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeProjectMember(id, userId);
      setMembers(members.filter(member => member.user_id !== userId));
      toast({
        title: "Member removed successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateMemberRole(id, userId, newRole);
      setMembers(members.map(member => 
        member.user_id === userId ? { ...member, role: newRole } : member
      ));
      toast({
        title: "Role updated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const availableUsers = users.filter(
    user => !members.some(member => member.email === user.email)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>
            Make changes to your project here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Project description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-4 items-start gap-4">
              <FormLabel className="text-right text-xs font-bold">
                Members
              </FormLabel>
              <div className="col-span-3 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {members.map((member) => (
                    <Badge key={member.id} variant="secondary" className="flex items-center gap-2">
                      {member.name}
                      <Select
                        defaultValue={member.role}
                        onValueChange={(value) => handleRoleChange(member.user_id, value)}
                      >
                        <SelectTrigger className="h-6 w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveMember(member.user_id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="newMember"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleAddMember(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add member..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.email}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
