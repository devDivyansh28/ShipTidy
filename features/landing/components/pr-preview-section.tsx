"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GitPullRequestIcon,
  SparkleIcon,
  ShieldCheckIcon,
  CheckIcon,
} from "@phosphor-icons/react";

export function PRPreviewSection() {
  const [resolved, setResolved] = useState(false);

  return (
    <section id="preview" className="py-20 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          See AI Reviews in Action
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          ShipTidy automatically inspects diffs, evaluates cross-file dependencies, and posts precise markdown feedback directly on GitHub.
        </p>
      </div>

      {/* Simulated GitHub PR Window */}
      <div className="rounded-xl border border-zinc-800 bg-[#0d1117] shadow-2xl overflow-hidden text-left">
        {/* Window Chrome Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-[#161b22] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-red-500/80 inline-block" />
              <span className="size-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="size-3 rounded-full bg-green-500/80 inline-block" />
            </div>
            <div className="h-4 w-px bg-zinc-700 mx-1 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <GitPullRequestIcon className="size-4 text-emerald-400" />
              <span className="text-zinc-400">acme-corp/api-gateway</span>
              <span className="text-zinc-600">#128</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Open
            </span>
            <span className="text-xs text-zinc-400 hidden sm:inline font-mono">
              feat/stripe-webhooks into main
            </span>
          </div>
        </div>

        {/* PR Diff Header */}
        <div className="border-b border-zinc-800/80 bg-[#161b22]/50 px-4 py-2 flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>lib/payment/handlers.ts</span>
          <span className="text-zinc-500">+14 -4 lines</span>
        </div>

        {/* Code Diff Display */}
        <div className="font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto divide-y divide-zinc-900">
          <div className="bg-[#161b22]/30 text-zinc-500 px-4 py-1 select-none">
            @@ -42,8 +42,12 @@ export async function handleCheckoutSession(event: StripeEvent)
          </div>

          <div className="flex px-4 py-0.5 bg-red-950/20 text-red-300">
            <span className="w-8 select-none text-red-500/60 text-right pr-3">-</span>
            <code>const customer = await stripe.customers.retrieve(session.customer);</code>
          </div>
          <div className="flex px-4 py-0.5 bg-red-950/20 text-red-300">
            <span className="w-8 select-none text-red-500/60 text-right pr-3">-</span>
            <code>await db.user.update(&#123; where: &#123; email: customer.email &#125;, data: &#123; pro: true &#125; &#125;);</code>
          </div>

          <div className="flex px-4 py-0.5 bg-emerald-950/30 text-emerald-300">
            <span className="w-8 select-none text-emerald-500/60 text-right pr-3">+</span>
            <code>const customer = await stripe.customers.retrieve(session.customer);</code>
          </div>
          <div className="flex px-4 py-0.5 bg-emerald-950/30 text-emerald-300">
            <span className="w-8 select-none text-emerald-500/60 text-right pr-3">+</span>
            <code>if (!customer || customer.deleted || !(&apos;email&apos; in customer) || !customer.email) &#123;</code>
          </div>
          <div className="flex px-4 py-0.5 bg-emerald-950/30 text-emerald-300">
            <span className="w-8 select-none text-emerald-500/60 text-right pr-3">+</span>
            <code>  throw new Error(&quot;Stripe customer record invalid or deleted&quot;);</code>
          </div>
          <div className="flex px-4 py-0.5 bg-emerald-950/30 text-emerald-300">
            <span className="w-8 select-none text-emerald-500/60 text-right pr-3">+</span>
            <code>&#125;</code>
          </div>
          <div className="flex px-4 py-0.5 bg-emerald-950/30 text-emerald-300">
            <span className="w-8 select-none text-emerald-500/60 text-right pr-3">+</span>
            <code>await db.user.update(&#123; where: &#123; email: customer.email &#125;, data: &#123; pro: true &#125; &#125;);</code>
          </div>
        </div>

        {/* Inline AI Review Comment Card */}
        <div className="p-4 sm:p-6 bg-[#090d13] border-t border-zinc-800">
          <div className="rounded-lg border border-emerald-500/30 bg-[#0d1117] p-4 sm:p-5 shadow-lg relative">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <SparkleIcon className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-zinc-100">
                      shiptidy-bot
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-zinc-700 bg-zinc-800 text-zinc-300">
                      bot
                    </Badge>
                    <span className="text-[11px] text-zinc-500">reviewed 2m ago</span>
                  </div>
                </div>
              </div>

              {resolved ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                  <CheckIcon className="size-3" /> Resolved
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="text-[10px] bg-emerald-950 text-emerald-300 border-emerald-800">
                    Reliability + Correctness
                  </Badge>
                </div>
              )}
            </div>

            <div className="text-xs sm:text-sm text-zinc-300 space-y-2">
              <p className="font-medium text-emerald-400 flex items-center gap-1.5">
                <ShieldCheckIcon className="size-4 text-emerald-400" />
                Excellent defensive check! Prevents fatal runtime webhook crashing.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Stripe&apos;s API allows <code className="text-zinc-200 bg-zinc-800/80 px-1 py-0.5 rounded text-xs">customer.deleted</code> to return a deleted customer payload where <code className="text-zinc-200 bg-zinc-800/80 px-1 py-0.5 rounded text-xs">customer.email</code> is undefined. Your validation cleanly intercepts this before attempting the database update.
              </p>
              <div className="bg-[#161b22] border border-zinc-800 rounded p-2.5 text-xs font-mono text-zinc-400">
                <span className="text-zinc-500">💡 Performance Tip:</span> Consider wrapping the database update inside a transaction if updating subscription logs simultaneously.
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-500 text-[11px]">
                Vector context: 4 related chunks found in Pinecone
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResolved(!resolved)}
                className="text-xs h-7 border-zinc-700 hover:bg-zinc-800 text-zinc-200"
              >
                {resolved ? "Reopen comment" : "Mark as resolved"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
