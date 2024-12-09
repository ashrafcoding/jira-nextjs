'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  GitBranch,
  Calendar,
  FileText,
  Kanban
} from 'lucide-react';
import { Project } from '@/lib/definitions';

interface ProjectNavProps {
  project: Project;
}

export function ProjectNav({ project }: ProjectNavProps) {
  const pathname = usePathname();
  
  const navigation = [
    {
      name: 'Overview',
      href: `/dashboard/projects/${project.id}`,
      icon: LayoutDashboard
    },
    {
      name: 'Board',
      href: `/dashboard/projects/${project.id}/board`,
      icon: Kanban
    },
    {
      name: 'Issues',
      href: `/dashboard/projects/${project.id}/issues`,
      icon: ListTodo
    },
    {
      name: 'Calendar',
      href: `/dashboard/projects/${project.id}/calendar`,
      icon: Calendar
    },
    {
      name: 'Documents',
      href: `/dashboard/projects/${project.id}/documents`,
      icon: FileText
    },
    {
      name: 'Team',
      href: `/dashboard/projects/${project.id}/team`,
      icon: Users
    },
    {
      name: 'Releases',
      href: `/dashboard/projects/${project.id}/releases`,
      icon: GitBranch
    },
    {
      name: 'Settings',
      href: `/dashboard/projects/${project.id}/settings`,
      icon: Settings
    },
  ];

  

  return (
    <div className="flex w-48 flex-col border-r bg-background">
      {/* Project Header */}
      <div className="flex flex-col items-center gap-3 p-6 border-b">
        <Avatar className="h-16 w-16">
          {project.avatar_url ? (
            <AvatarImage src={project.avatar_url} alt={project.name} />
          ) : (
            <AvatarFallback  className="bg-primary/10">
              {project.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">{project.name}</h2>
          {project.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="block"
            >
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive && 'bg-secondary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}