import type { HubOverviewData } from "@/features/overview/types/hub";
import { getUsageSummary } from "@/features/billing/server/usage";
import {
  getInstallationStatus,
  getUserInstallationId,
} from "@/features/github/server/installation";
import { getUserSubscription } from "@/features/settings/server/subscription";
import { prisma } from "@/lib/db";
import { getInstallationRepoSummary } from "./repo-summary";

export async function getHubOverview(userId: string): Promise<HubOverviewData> {
  const [user, installation, subscription, usage, installationId] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      }),
      getInstallationStatus(userId),
      getUserSubscription(userId),
      getUsageSummary(userId),
      getUserInstallationId(userId),
    ]);

  let repoSummary = {
    totalCount: 0,
    publicCount: 0,
    privateCount: 0,
    syncedCount: 0,
    connected: false,
  };

  let totalReviews = 0;
  let latestReview: HubOverviewData["pullRequests"]["latestReview"] = null;

  if (installation.connected && installationId) {
    try {
      const [ghRepos, syncedCount, prCount, latestPr] = await Promise.all([
        getInstallationRepoSummary(installationId).catch(() => null),
        prisma.repoSync.count({
          where: { installationId, status: "synced" },
        }),
        prisma.pullRequest.count({
          where: { installationId },
        }),
        prisma.pullRequest.findFirst({
          where: {
            installationId,
            status: { in: ["reviewed", "rate_limited"] },
          },
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            repoFullName: true,
            prNumber: true,
            title: true,
            status: true,
            reviewedAt: true,
            updatedAt: true,
          },
        }),
      ]);

      if (ghRepos) {
        repoSummary = {
          totalCount: ghRepos.totalCount,
          publicCount: ghRepos.publicCount,
          privateCount: ghRepos.privateCount,
          syncedCount,
          connected: true,
        };
      } else {
        repoSummary.connected = true;
        repoSummary.syncedCount = syncedCount;
      }

      totalReviews = prCount;

      if (latestPr) {
        latestReview = {
          id: latestPr.id,
          repoFullName: latestPr.repoFullName,
          prNumber: `#${latestPr.prNumber}`,
          title: latestPr.title,
          status: latestPr.status === "rate_limited" ? "rate_limited" : "approved",
          reviewedAt: (latestPr.reviewedAt || latestPr.updatedAt).toISOString(),
        };
      }
    } catch (e) {
      console.error("Error loading hub details:", e);
    }
  }

  return {
    userName: user?.name || "Developer",
    userEmail: user?.email || "",
    github: installation,
    repositories: repoSummary,
    pullRequests: {
      totalReviews,
      latestReview,
    },
    settings: {
      plan: subscription.plan,
      reviewsUsed: usage.used,
      reviewsLimit: usage.limit,
      status: subscription.status,
      renewsAt: subscription.renewsAt,
    },
  };
}
