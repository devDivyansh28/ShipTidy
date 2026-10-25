"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { githubRepoKeys } from "@/features/github/lib/repos-query";
import { syncRepoCodebase, getSingleRepoSyncStatus } from "../actions/repo-sync";
import { Button } from "@/components/ui/button";
import { RepoSyncStatus } from "../types";
import { toast } from "sonner";
import { statusBadge } from "@/features/dashboard/lib/status-styles";

type SyncRepoButtonProps = {
  repoFullName: string;
  branch: string;
  syncStatus: RepoSyncStatus | null;
};

function isSyncing(status: RepoSyncStatus | null, mutationPending: boolean) {
  if (mutationPending) {
    return true;
  }

  return status === "pending" || status === "syncing";
}

function getButtonLabel(
  status: RepoSyncStatus | null,
  mutationPending: boolean,
) {
  if (isSyncing(status, mutationPending)) {
    return "Syncing…";
  }

  if (status === "synced") {
    return "Re-sync";
  }

  if (status === "failed") {
    return "Retry";
  }

  return "Sync";
}

const SyncRepoButton = ({
  repoFullName,
  branch,
  syncStatus,
}: SyncRepoButtonProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const syncRepo = useMutation({
    mutationFn: () => syncRepoCodebase(repoFullName, branch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: githubRepoKeys.all });
      toast.info(`Sync started for ${repoFullName}`);
    },
    onError: (error) => {
      toast.error(`Failed to sync repo ${repoFullName}: ${error.message}`);
    },
  });

  const syncing = isSyncing(syncStatus, syncRepo.isPending);

  // Watches sync progress dynamically — works for fast or long-running jobs,
  // and resumes even if the user refreshes mid-sync.
  useEffect(() => {
    if (syncStatus !== "pending" && syncStatus !== "syncing") {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const latestStatus = await getSingleRepoSyncStatus(repoFullName);
        if (
          latestStatus &&
          latestStatus !== "pending" &&
          latestStatus !== "syncing"
        ) {
          clearInterval(intervalId);
          queryClient.invalidateQueries({ queryKey: githubRepoKeys.all });
          router.refresh();

          if (latestStatus === "synced") {
            toast.success(`Repo ${repoFullName} synced successfully`);
          } else if (latestStatus === "failed") {
            toast.error(`Failed to sync repo ${repoFullName}`);
          }
        }
      } catch {
        // Ignore temporary network hiccups during checks
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [syncStatus, repoFullName, queryClient, router]);

  const badgeTone =
    syncStatus === "synced"
      ? "success"
      : syncStatus === "failed"
        ? "danger"
        : "warning";

  return (
    <div className="flex items-center justify-end gap-2">
      {syncStatus && (
        <span className={statusBadge(badgeTone)}>{syncStatus}</span>
      )}
      <Button
        size="sm"
        variant="outline"
        disabled={syncing}
        onClick={() => syncRepo.mutate()}
      >
        {getButtonLabel(syncStatus, syncRepo.isPending)}
      </Button>
    </div>
  );
};

export default SyncRepoButton;
