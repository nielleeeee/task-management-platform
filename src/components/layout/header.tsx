"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import SignOutButton from "@/components/form/sign-out-button";
import SignInButton from "@/components/form/sign-in-button";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            TMP
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <span>Hello, {session?.user?.name}</span>

          <SignOutButton />
        </nav>

        {/* Mobile navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="p-4" side="right">
            <SheetTitle>Hello, {session?.user?.name}</SheetTitle>

            <nav className="flex flex-col gap-4 mt-8">
              <SignOutButton />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
