import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";

type DashboardPlaceholderProps = {
  title: string;
  description: string;
};

export function DashboardPlaceholder({
  title,
  description,
}: DashboardPlaceholderProps) {
  return (
    <DashboardSectionCard title={title}>
      <div className="rounded-2xl border border-dashed border-[#d4e4fb] bg-white px-6 py-16 text-center">
        <h2 className="text-2xl font-medium text-[#3446a4]">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-8 text-[#7787a5]">
          {description}
        </p>
      </div>
    </DashboardSectionCard>
  );
}
