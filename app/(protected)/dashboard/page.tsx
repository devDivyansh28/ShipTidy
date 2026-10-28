import { redirect } from "next/navigation";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

export default function DashboardRootPage() {
  redirect(DASHBOARD_ROUTES.overview);
}
