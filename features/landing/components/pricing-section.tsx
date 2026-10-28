"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { CheckIcon, SparkleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <section id="pricing" className="py-24 px-4 max-w-5xl mx-auto border-t border-zinc-900">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Transparent, Predictable Pricing
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Start for free on public repositories. Upgrade to Pro for unlimited reviews and private codebases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Free</h3>
              <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-xs">
                Open Source
              </Badge>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white tracking-tight">$0</span>
              <span className="text-zinc-500 text-sm ml-2">/ month</span>
            </div>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Ideal for open-source contributors and individual developers testing automated code reviews.
            </p>

            <ul className="space-y-3 text-sm text-zinc-300 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckIcon className="size-4 text-emerald-400 shrink-0" />
                <span>5 AI code reviews / month</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckIcon className="size-4 text-emerald-400 shrink-0" />
                <span>Public GitHub repositories</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckIcon className="size-4 text-emerald-400 shrink-0" />
                <span>Standard PR diff analysis</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckIcon className="size-4 text-emerald-400 shrink-0" />
                <span>Basic markdown comments</span>
              </li>
            </ul>
          </div>

          <Link
            href={user ? "/dashboard" : "/sign-in"}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white flex items-center justify-center h-9"
            )}
          >
            {user ? "Current Plan" : "Get Started Free"}
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="rounded-xl border-2 border-emerald-500/50 bg-zinc-950 p-8 flex flex-col justify-between relative shadow-[0_0_35px_rgba(16,185,129,0.1)]">
          <div className="absolute -top-3 right-6">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500 text-black px-3 py-0.5 rounded-full uppercase tracking-wider">
              <SparkleIcon className="size-3" /> Most Popular
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Pro</h3>
              <Badge variant="secondary" className="bg-emerald-950 text-emerald-300 border-emerald-800 text-xs">
                For Teams & Pros
              </Badge>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white tracking-tight">$19</span>
              <span className="text-zinc-500 text-sm ml-2">/ month</span>
            </div>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Unlimited code intelligence with Pinecone vector sync for teams building mission-critical software.
            </p>

            <ul className="space-y-3 text-sm text-zinc-300 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckIcon className="size-4 text-emerald-400 shrink-0" />
                <span className="font-medium text-white">Unlimited AI reviews</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckIcon className="size-4 text-emerald-400 shrink-0" />
                <span className="font-medium text-white">Private & public repositories</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckIcon className="size-4 text-emerald-400 shrink-0" />
                <span>Full Pinecone codebase indexing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckIcon className="size-4 text-emerald-400 shrink-0" />
                <span>Cross-file semantic dependency checks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckIcon className="size-4 text-emerald-400 shrink-0" />
                <span>Priority AI model reasoning</span>
              </li>
            </ul>
          </div>

          <Link
            href={user ? "/dashboard/settings" : "/sign-in"}
            className={cn(
              buttonVariants(),
              "w-full bg-white text-black hover:bg-zinc-200 font-semibold shadow flex items-center justify-center h-9"
            )}
          >
            {user ? "Upgrade in Settings" : "Start with Pro"}
          </Link>
        </div>
      </div>
    </section>
  );
}
