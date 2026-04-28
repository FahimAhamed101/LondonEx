import type { ReactNode } from "react";

type DashboardSectionCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
  actionLabel?: string;
};

export function DashboardSectionCard({
  title,
  children,
  className = "",
  actionLabel,
}: DashboardSectionCardProps) {
  return (
    <section
      className={`rounded-[14px] border border-[#d4e4fb] bg-[#fbfdff] p-3.5 shadow-[0_10px_30px_rgba(22,43,120,0.025)] sm:p-4 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[14px] font-medium text-[#3542a3]">{title}</h2>
        {actionLabel ? (
          <button
            type="button"
            className="rounded-full border border-[#d6e6fa] bg-[#f7fbff] px-4 py-1.5 text-[13px] font-medium text-[#42aae0]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}
