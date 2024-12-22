"use client";
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface UserAvatarProps {
  user: {
    name?: string | null;
    email?: string | null;
    // image?: string | null;
  };
}

export function UserAvatar({ user }: UserAvatarProps) {
  const handleSignOut = () => {
    signOut();
  };

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost"  className="relative h-10 w-10 pb-5 rounded-full">
          <Image
            src={'/avatar2.png'}
            alt={user.name || 'User Avatar'}
            sizes="30px"
            fill
            className="rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 rounded-2xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer" >
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </DropdownMenuItem>       
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
