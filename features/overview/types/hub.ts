import type {
  GithubInstallationStatus,
  SubscriptionPlan,
} from "@/features/dashboard/lib/types";

export type HubRepoSummary = {
  totalCount: number;
  publicCount: number;
  privateCount: number;
  syncedCount: number;
  connected: boolean;
};

export type HubPRSummary = {
  totalReviews: number;
  latestReview: {
    id: string;
    repoFullName: string;
    prNumber: string;
    title: string;
    status: "approved" | "changes_requested" | "rate_limited";
    reviewedAt: string;
  } | null;
};

export type HubSettingsSummary = {
  plan: SubscriptionPlan;
  reviewsUsed: number;
  reviewsLimit: number | null;
  status: "active" | "canceled" | "trialing";
  renewsAt: string | null;
};

export type HubOverviewData = {
  userName: string;
  userEmail: string;
  github: GithubInstallationStatus;
  repositories: HubRepoSummary;
  pullRequests: HubPRSummary;
  settings: HubSettingsSummary;
};
