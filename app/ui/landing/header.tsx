// 'use client';

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import Image from "next/image";
import {auth} from "@/auth"
import { UserAvatar } from '@/components/user-avatar';

export async function Header() {
  const session = await auth();

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 md:gap-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="  flex items-center gap-2">
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
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            {/* Add your menu icon here */}
          </button>
        </div>
        
        <div className="hidden pt-2 md:flex md:gap-x-12">
          <Link href="/features" className="text-sm font-semibold leading-6">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-semibold leading-6">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-semibold leading-6">
            About
          </Link>
          <Link href="/contact" className="text-sm font-semibold leading-6">
            Contact
          </Link>
        </div>
        
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
