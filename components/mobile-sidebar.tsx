"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { UserAvatar } from './user-avatar';
import { ModeToggle } from './mode-toggle';

interface MobileSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function MobileSidebar({ user }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[300px] flex flex-col"
        // onCloseButtonClick={() => setIsOpen(false)}
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>         
        </SheetHeader>

        <div className="flex flex-col space-y-4 pt-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 mb-6"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-2xl font-bold">Bug Buster</span>
          </Link>

          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-semibold hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <ModeToggle />
              {user ? (
                <UserAvatar user={user} />
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost">Log in</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button>Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
