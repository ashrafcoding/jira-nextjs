"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Kanban,
  // Users,
  Settings,
  HelpCircle,
  // Folder,
  // Briefcase,
  FileText
} from 'lucide-react';
import { UserAvatar } from './user-avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import Image from 'next/image';
import { ModeToggle } from './mode-toggle';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'dashboard', icon: LayoutDashboard },
  // { href: '/projects', label: 'Projects', icon: Folder },
  { href: '/tasks', label: 'Issues', icon: Kanban },
  // { href: '/team', label: 'Team', icon: Users },
  // { href: '/workspaces', label: 'Workspaces', icon: Briefcase },
  { href: '/reports', label: 'Reports', icon: FileText },
];

const bottomNavItems: NavItem[] = [
  { href: '/team', label: 'Settings', icon: Settings },
  { href: '/dashboard/#', label: 'Help', icon: HelpCircle },
];

interface SideNavProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function SideNav({ user }: SideNavProps) {
  const pathname = usePathname();

  const NavItemComponent = ({ href, label, icon: Icon }: NavItem) => {
    const isActive = pathname === href;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={`
                flex items-center justify-center py-2  rounded-xl transition-colors duration-200
                ${isActive
                  ?' bg-primary-foreground text-primary'
                  :'hover:bg-primary-foreground/60 hover:text-primary'}
                }
              `}
            >
              <Icon className="h-5 w-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-22  bg-primary text-primary-foreground border-r flex flex-col">
      <div className="flex h-full flex-col items-center">
        {/* Logo and Brand */}
        <div className="flex flex-col gap-3 items-center justify-center p-4 border-b w-full">
          <div>
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo.png"
              priority
              alt="Logo"
              width={45}
              height={45}
              className="rounded-full"
            />         
          </Link>
          </div>
          <div><ModeToggle /></div>
        </div>
        

        {/* Navigation */}
        <nav className="flex-1 w-full p-2  space-y-8">
          
          {navItems.map((item) => (
            <NavItemComponent key={item.href} {...item} />
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t w-full p-2 space-y-2">
          {bottomNavItems.map((item) => (
            <NavItemComponent key={item.label} {...item} />
          ))}

          {/* User Avatar */}
          {user && (

            <div className="flex justify-center mt-2">
              <UserAvatar user={user} />
            </div>

          )}
        </div>
      </div>
    </aside>
  );
}

// Mobile Sidebar Variant
export function MobileSideNav({ user }: SideNavProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <LayoutDashboard className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-40 h-screen">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo.png"
              priority
              alt="Logo"
              width={45}
              height={45}
              className="rounded-full"
            />         
          </Link>
          </SheetTitle>
         
        </SheetHeader>

        <nav className="mt-6 space-y-2">
          {[...navItems, ...bottomNavItems].map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center p-2 rounded-lg transition-colors duration-200
                  ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'}
                `}
              >
                <Icon className="mr-3 h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between space-x-3">
              <UserAvatar user={user} />
              <ModeToggle />
              
              {/* <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div> */}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
