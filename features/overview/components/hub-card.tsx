"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/ui/button";
import { statusBadge } from "@/features/dashboard/lib/status-styles";
import { cn } from "@/lib/utils";

export type HubCardProps = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: {
    label: string;
    tone: "success" | "warning" | "danger" | "info" | "neutral";
  };
  metrics: {
    label: string;
    value: string | number;
    sublabel?: string;
  }[];
  highlight?: React.ReactNode;
  action: {
    label: string;
    href: string;
  };
};

export function HubCard({
  title,
  description,
  icon: Icon,
  badge,
  metrics,
  highlight,
  action,
}: HubCardProps) {
  return (
    <div className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-zinc-700 hover:shadow-md">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground transition-colors group-hover:border-emerald-500/30 group-hover:text-emerald-400">
              <Icon className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>

          <span className={statusBadge(badge.tone, "rounded-md shrink-0")}>
            {badge.label}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 py-4 my-2 border-y border-border/60">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">
                {m.label}
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground mt-0.5">
                {m.value}
              </span>
              {m.sublabel ? (
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  {m.sublabel}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {/* Highlight slot (if any) */}
        {highlight ? <div className="mt-3 mb-4">{highlight}</div> : null}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-2">
        <Link
          href={action.href}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-between bg-muted/40 hover:bg-muted text-foreground font-medium text-xs h-9 px-3 rounded-lg border-border"
          )}
        >
          <span>{action.label}</span>
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
