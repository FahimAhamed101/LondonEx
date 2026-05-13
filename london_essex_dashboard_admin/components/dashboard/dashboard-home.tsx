"use client";

import { DashboardStatsRow } from "@/components/dashboard/dashboard-stats-row";
import { RecentSubmissionsCard } from "@/components/dashboard/recent-submissions-card";
import { SystemActivityPanel } from "@/components/dashboard/system-activity-panel";
import { UserDashboardView } from "@/components/dashboard/user-dashboard-view";
import { useAuthenticatedUser } from "@/features/auth/use-authenticated-user";

function AdminDashboardView() {
  return (
    <div className="space-y-5">
      <DashboardStatsRow />

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="col-span-12 xl:col-span-8">
          <RecentSubmissionsCard />
        </div>

        <div className="col-span-12 space-y-5 xl:col-span-4">
          <SystemActivityPanel />
        </div>
      </div>
    </div>
  );
}

export function DashboardHome() {
  const { user, isLoading } = useAuthenticatedUser();

  if (isLoading || !user) {
    return (
      <div className="rounded-xl border border-[#e4edf8] bg-white px-4 py-10 text-center text-sm text-[#7a86a4]">
        Loading dashboard...
      </div>
    );
  }

  if (user.role === "admin") {
    return <AdminDashboardView />;
  }

  return <UserDashboardView />;
}
