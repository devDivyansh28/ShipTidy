"use client";

import Link from "next/link";
import type { HubOverviewData } from "@/features/overview/types/hub";
import { HubCard } from "./hub-card";
import {
  BookIcon,
  GitPullRequestIcon,
  GithubLogoIcon,
  GearIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  SparkleIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

export function OverviewHub({ data }: { data: HubOverviewData }) {
  const { userName, github, repositories, pullRequests, settings } = data;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl w-full mx-auto">
      {/* Welcome & Status Bar */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
            Welcome back, {userName}
            <SparkleIcon className="size-4 text-emerald-400" />
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Here is your workspace summary. Choose any area below to jump directly into it.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-muted/50 text-muted-foreground">
            {github.connected ? (
              <>
                <CheckCircleIcon className="size-3.5 text-emerald-500" />
                <span>GitHub: <strong className="text-foreground font-medium">@{github.accountLogin}</strong></span>
              </>
            ) : (
              <>
                <WarningCircleIcon className="size-3.5 text-amber-500" />
                <span>GitHub: <strong className="text-foreground font-medium">Disconnected</strong></span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-muted/50 text-muted-foreground">
            <span>Plan: <strong className="text-foreground font-medium uppercase text-[11px]">{settings.plan}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-muted/50 text-muted-foreground">
            <span>Reviews: <strong className="text-foreground font-medium">{settings.reviewsUsed} used</strong></span>
          </div>
        </div>
      </div>

      {/* Disconnected Onboarding Banner (if GitHub not installed yet) */}
      {!github.connected ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <WarningCircleIcon className="size-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold text-amber-200">GitHub App Not Connected</p>
              <p className="text-amber-300/80 mt-0.5">
                Install the ShipTidy GitHub App on your account or organization to enable automated PR reviews.
              </p>
            </div>
          </div>
          <Link
            href={DASHBOARD_ROUTES.github}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition-colors"
          >
            Connect GitHub App
            <ArrowRightIcon className="size-3" />
          </Link>
        </div>
      ) : null}

      {/* 4 Core Hub Cards (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Repositories Card */}
        <HubCard
          title="Repositories"
          description="Connected codebases & vector index"
          icon={BookIcon}
          badge={{
            label: repositories.connected ? `${repositories.totalCount} Repos` : "Disconnected",
            tone: repositories.connected ? "success" : "warning",
          }}
          metrics={[
            {
              label: "Total Repositories",
              value: repositories.connected ? repositories.totalCount : "0",
              sublabel: repositories.connected
                ? `${repositories.publicCount} public · ${repositories.privateCount} private`
                : "Install app to load",
            },
            {
              label: "Vector Synced",
              value: repositories.syncedCount,
              sublabel: "Indexed in Pinecone",
            },
          ]}
          highlight={
            <div className="rounded-md border border-border/60 bg-muted/30 p-2.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">💡 Vector RAG:</span> Syncing a repository allows the AI to inspect related interfaces and utilities across your whole codebase.
            </div>
          }
          action={{
            label: "Browse & Sync Repositories",
            href: DASHBOARD_ROUTES.repos,
          }}
        />

        {/* 2. Pull Requests Card */}
        <HubCard
          title="Pull Requests"
          description="Automated AI reviews & comments"
          icon={GitPullRequestIcon}
          badge={{
            label: pullRequests.totalReviews > 0 ? `${pullRequests.totalReviews} Reviews` : "Ready",
            tone: "info",
          }}
          metrics={[
            {
              label: "Total PR Reviews",
              value: pullRequests.totalReviews,
              sublabel: "Generated by AI model",
            },
            {
              label: "Webhook Status",
              value: "Listening",
              sublabel: "opened, sync, reopen",
            },
          ]}
          highlight={
            pullRequests.latestReview ? (
              <div className="rounded-md border border-border/60 bg-muted/30 p-2.5 text-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="font-medium text-foreground truncate max-w-[200px]">
                    {pullRequests.latestReview.repoFullName}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {pullRequests.latestReview.prNumber}
                  </span>
                </div>
                <p className="text-muted-foreground truncate text-[11px]">
                  {pullRequests.latestReview.title}
                </p>
              </div>
            ) : (
              <div className="rounded-md border border-border/60 bg-muted/30 p-2.5 text-xs text-muted-foreground">
                No reviews yet. Open or update a pull request on any connected repository to trigger your first review.
              </div>
            )
          }
          action={{
            label: "View Pull Request Reviews",
            href: DASHBOARD_ROUTES.pullRequest,
          }}
        />

        {/* 3. GitHub App Card */}
        <HubCard
          title="GitHub App"
          description="Installation & webhook settings"
          icon={GithubLogoIcon}
          badge={{
            label: github.connected ? "Connected" : "Action Needed",
            tone: github.connected ? "success" : "danger",
          }}
          metrics={[
            {
              label: "App Status",
              value: github.connected ? "Active" : "Not Installed",
              sublabel: github.installedAt
                ? `Since ${new Date(github.installedAt).toLocaleDateString()}`
                : "Setup required",
            },
            {
              label: "Target Account",
              value: github.accountLogin ? `@${github.accountLogin}` : "None",
              sublabel: "Organization / User",
            },
          ]}
          highlight={
            <div className="rounded-md border border-border/60 bg-muted/30 p-2.5 text-xs text-muted-foreground">
              {github.connected ? (
                <span>Webhooks are securely verified and listening for pull request events in real time.</span>
              ) : (
                <span className="text-amber-400 font-medium">Click below to install the GitHub App and grant repository access.</span>
              )}
            </div>
          }
          action={{
            label: "Configure GitHub App",
            href: DASHBOARD_ROUTES.github,
          }}
        />

        {/* 4. Settings & Billing Card */}
        <HubCard
          title="Settings & Billing"
          description="Subscription plan & account preferences"
          icon={GearIcon}
          badge={{
            label: settings.plan === "pro" ? "Pro Plan" : "Free Plan",
            tone: settings.plan === "pro" ? "success" : "neutral",
          }}
          metrics={[
            {
              label: "Monthly Usage",
              value: `${settings.reviewsUsed} / ${settings.reviewsLimit !== null ? settings.reviewsLimit : "∞"}`,
              sublabel: settings.plan === "pro"
                ? "Unlimited reviews"
                : `${Math.max(0, (settings.reviewsLimit || 5) - settings.reviewsUsed)} reviews remaining`,
            },
            {
              label: "Plan Status",
              value: settings.status === "active" ? "Active" : "Free Tier",
              sublabel: settings.renewsAt
                ? `Renews ${new Date(settings.renewsAt).toLocaleDateString()}`
                : "No auto-renewal",
            },
          ]}
          highlight={
            <div className="rounded-md border border-border/60 bg-muted/30 p-2.5 text-xs text-muted-foreground">
              {settings.plan === "pro" ? (
                <span>All Pro capabilities unlocked: unlimited AI reviews and private repository support.</span>
              ) : (
                <span>Free plan includes 5 reviews/mo. Upgrade to Pro for unlimited reviews and private repos.</span>
              )}
            </div>
          }
          action={{
            label: "Manage Settings & Billing",
            href: DASHBOARD_ROUTES.settings,
          }}
        />
      </div>
    </div>
  );
}
