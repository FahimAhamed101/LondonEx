import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";
import { recentActivities } from "@/features/dashboard/data";

export function SystemActivityPanel() {
  return (
    <DashboardSectionCard title="System Activity">
      <div className="rounded-2xl border border-[#e8eef8] bg-white px-4 py-3">
        {recentActivities.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
                key={`${item.title}-${index}`}
                className={`flex items-start gap-3 py-4 ${
                  index < recentActivities.length - 1
                    ? "border-b border-[#edf2fa]"
                    : ""
                }`}
            >
              <div
                className={`grid h-8 w-8 place-items-center rounded-full ${item.iconBg} ${item.iconColor}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] leading-6 text-[#3242a4]">
                  {item.title}
                </p>
                {item.time ? (
                  <p className="text-[12px] text-[#8792aa]">{item.time}</p>
                ) : null}
                {item.subtitle ? (
                  <p className="text-[12px] text-[#8792aa]">{item.subtitle}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardSectionCard>
  );
}
