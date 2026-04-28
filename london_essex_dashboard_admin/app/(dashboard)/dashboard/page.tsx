// import { DashboardActionPanel } from "@/components/dashboard/dashboard-action-panel";
import { DashboardStatsRow } from "@/components/dashboard/dashboard-stats-row";
import { RecentSubmissionsCard } from "@/components/dashboard/recent-submissions-card";
import { SystemActivityPanel } from "@/components/dashboard/system-activity-panel";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <DashboardStatsRow />

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="col-span-12 xl:col-span-8">
          <RecentSubmissionsCard />
        </div>

        <div className="col-span-12 space-y-5 xl:col-span-4">
          {/* <DashboardActionPanel /> */}
          <SystemActivityPanel />
        </div>
      </div>
    </div>
  );
}
