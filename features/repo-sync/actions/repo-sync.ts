"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "../../auth/actions";
import { getUserInstallationId } from "../../github/server/installation";
import { DASHBOARD_ROUTES } from "../../dashboard/lib/routes";
import { triggerRepoSync } from "../server/repo-sync";
import { prisma } from "@/lib/db";

const STALE_SYNC_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export async function getSingleRepoSyncStatus(repoFullName: string) {
  const sync = await prisma.repoSync.findUnique({
    where: { repoFullName },
    select: { status: true, updateAt: true },
  });

  if (!sync) {
    return null;
  }

  // Self-heal: if stuck in syncing/pending for > 5 minutes, mark as failed
  if (
    (sync.status === "syncing" || sync.status === "pending") &&
    Date.now() - sync.updateAt.getTime() > STALE_SYNC_TIMEOUT_MS
  ) {
    await prisma.repoSync.update({
      where: { repoFullName },
      data: { status: "failed" },
    });
    return "failed";
  }

  return sync.status;
}

export async function syncRepoCodebase(repoFullName: string, branch: string) {
  const session = await getServerSession();

  if (!session) {
    redirect("./sign-in");
  }

  const installationId = await getUserInstallationId(session.user.id);

  if (!installationId) {
    redirect(DASHBOARD_ROUTES.github);
  }

  await triggerRepoSync(installationId, repoFullName, branch);
}