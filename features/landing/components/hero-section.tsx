"use client";

import Link from "next/link";
import { HeatmapText } from "./heatmap-text";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { GithubSignInForm } from "@/features/auth/components/github-sign-in-form";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden flex flex-col items-center text-center px-4">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none opacity-25 blur-3xl -z-10"
        style={{
          background: "radial-gradient(circle, rgba(38,166,65,0.2) 0%, rgba(14,68,41,0.05) 50%, transparent 80%)",
        }}
      />

      {/* Main Heatmap Text Display */}
      <div className="w-full mb-8">
        <HeatmapText />
      </div>

      {/* Status Pill Badge (Cosign style: "● Cosigning is open") */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs sm:text-sm font-medium mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-fade-in">
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
        </span>
        AI Code Reviews Active
      </div>

      {/* Subheadline */}
      <p className="max-w-2xl text-base sm:text-lg md:text-xl text-zinc-400 font-normal leading-relaxed mb-10 tracking-tight">
        Automated, context-aware AI code reviews for every pull request on your GitHub repositories.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto rounded-lg bg-white text-black hover:bg-zinc-200 font-semibold text-sm px-7 py-5 h-auto transition-all duration-200 shadow-md flex items-center justify-center gap-2"
              )}
            >
              Open Dashboard
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              href="/dashboard/repos"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto rounded-lg border-zinc-800 bg-zinc-950 text-zinc-200 hover:bg-zinc-900 hover:text-white font-medium text-sm px-7 py-5 h-auto transition-all duration-200 flex items-center justify-center"
              )}
            >
              My Repositories
            </Link>
          </>
        ) : (
          <>
            <div className="w-full sm:w-auto min-w-[200px]">
              <GithubSignInForm callbackUrl="/dashboard" />
            </div>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto rounded-lg border-zinc-800 bg-zinc-950 text-zinc-200 hover:bg-zinc-900 hover:text-white font-medium text-sm px-7 py-3 h-10 transition-all duration-200 flex items-center justify-center"
              )}
            >
              Dashboard
            </Link>
          </>
        )}
      </div>

      {/* Social proof bullets */}
      <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-zinc-600" />
          No CI YAML config needed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-zinc-600" />
          Full Pinecone vector context
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-zinc-600" />
          Free 5 reviews/month
        </span>
      </div>
    </section>
  );
}
