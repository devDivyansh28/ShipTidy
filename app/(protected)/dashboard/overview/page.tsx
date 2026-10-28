import type { Metadata } from "next";
import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { getHubOverview } from "@/features/overview/server/hub-data";
import { OverviewHub } from "@/features/overview/components/overview-hub";

export const metadata: Metadata = {
  title: "Overview · Dashboard",
};

export default async function DashboardOverviewPage() {
  const session = await requireAuth();
  const data = await getHubOverview(session.user.id);

  return (
    <>
      <DashboardHeader
        title="Overview"
        description="Your workspace overview and quick navigation across ShipTidy."
      />
      <OverviewHub data={data} />
    </>
  );
}
