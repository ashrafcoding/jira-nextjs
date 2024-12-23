"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Users } from "lucide-react";
import { createTeam, addTeamMember, updateTeam } from "@/app/controllers/users";
import { Team } from "@/lib/definitions";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
});

export function CreateTeamModal({
  children = null,
  team = null,
}: {
  children?: React.ReactNode ;
  team?: Team | null;
}) {
  const { data: session } = useSession();
  
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      if (session?.user) {
        if (team) {
          await updateTeam(team.id, data.name);
          toast({
            title: "Team updated successfully",
          });
        } else {
          const newTeam = await createTeam(
            data,
            session?.user?.email as string
          );
          if (newTeam) {
             await addTeamMember(newTeam.id, session?.user?.email as string);
            
          }

          toast({
            title: "Team created successfully",
          });
        }
        form.reset();
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <PlusCircle className="mr-1 h-4 w-4" />
            New Team
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center justify-center space-y-1.5 text-center ">
          <Users className="" />
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-center "
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Team Name"
                      type="text"
                      {...field}
                      value={team?.name || field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className="disaabled:animate-pulse w-1/2 my-4 "
            >
              Save changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
