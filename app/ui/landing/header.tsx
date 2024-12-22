// 'use client';

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import Image from "next/image";
import {auth} from "@/auth"
import { UserAvatar } from '@/components/user-avatar';
import { MobileSidebar } from '@/components/mobile-sidebar';

export default async function Header() {
  const session = await auth();

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center  justify-between p-6 md:gap-8 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="sr-only">Bug Buster</span>
            <Image
              src="/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Bug Buster</p>
          </Link>
        </div>

        {/* Mobile Sidebar Toggle */}
        <MobileSidebar user={session?.user} />


        {/* Desktop Navigation Links */}
        <div className="hidden pt-2 md:flex md:gap-x-12">
          <Link href="/dashboard" className="text-sm font-semibold leading-6">
            Dashboard
          </Link>
          <Link href="#pricing" className="text-sm font-semibold leading-6">
            Pricing
          </Link>
          <Link href="#contact" className="text-sm font-semibold leading-6">
            Contact
          </Link>
        </div>
        
        {/* Desktop User Actions */}
        <div className="hidden md:flex md:flex-1 md:justify-end md:gap-x-4 lg:flex lg:gap-x-4">
          <ModeToggle />
          {session?.user ? (
            <UserAvatar user={session.user} />
          ) : (
            <div>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
