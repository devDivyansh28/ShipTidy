"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserMenu } from "@/features/auth/components/user-menu";
import { authClient } from "@/lib/auth-client";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-semibold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            shiptidy
          </span>
          <span className="text-zinc-600 font-light text-base">/</span>
          <span className="text-zinc-400 text-sm font-normal hidden sm:inline">
            AI Code Reviewer
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link
            href="#features"
            className="hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="#preview"
            className="hover:text-white transition-colors"
          >
            Preview
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="hover:text-white transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-white text-black hover:bg-zinc-200 font-medium flex items-center gap-1.5 h-8 px-3 rounded-md"
                )}
              >
                Dashboard
                <ArrowRightIcon className="size-3.5" />
              </Link>
              <UserMenu user={user} variant="compact" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-zinc-300 hover:text-white h-8 px-3"
                )}
              >
                Sign in
              </Link>
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-white text-black hover:bg-zinc-200 font-medium h-8 px-3 rounded-md"
                )}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
