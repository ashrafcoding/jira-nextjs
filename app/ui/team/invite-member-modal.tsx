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
//   DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import {  addTeamMember  } from "@/app/controllers/users";
import { Team } from "@/lib/definitions";

const FormSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

export function InviteMemberModal({
  team ,
}: {
  team: Team ;
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
        const member = await addTeamMember(team?.id as string, data.email);
        if(member.message){
          toast({
            title: member.message,
          })
          setLoading(false);
          return;
        }        
        else{
          toast({
            title: "member invited successfully",
          })
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <Dialog >
      <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-1 h-4 w-4" />
            Invite Member
          </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
          <DialogTitle>Invite New Member</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center "
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="Enter Email Address"
                      type="text"
                      {...field}
                      value={ field.value || ""}
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
              invite
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
