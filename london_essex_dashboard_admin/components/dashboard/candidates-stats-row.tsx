"use client";

import { useEffect, useState } from "react";
import { CircleCheckBig, ClipboardList, Users } from "lucide-react";
import { candidateStats } from "@/features/dashboard/data";
import type { CandidateStat } from "@/types/dashboard";

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [duration, target]);

  return value;
}

function AnimatedStatValue({ value }: { value: string }) {
  const target = Number(value.replace(/,/g, ""));
  const animatedValue = useCountUp(Number.isNaN(target) ? 0 : target);

  return (
    <p className="text-[30px] font-semibold leading-none text-[#1f2435]">
      {animatedValue.toLocaleString()}
    </p>
  );
}

type CandidatesStatsRowProps = {
  stats?: CandidateStat[];
};

export function CandidatesStatsRow({
  stats = candidateStats,
}: CandidatesStatsRowProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        const isCustomIcon = item.iconBg.length === 0 && item.iconColor.length === 0;

        return (
          <article
            key={item.label}
            className="rounded-2xl border border-[#e2e8f6] bg-white px-4 py-4 shadow-[0_10px_26px_rgba(23,42,98,0.04)]"
          >
            <div className="flex items-center gap-3">
              {isCustomIcon ? (
                <Icon className="h-12 w-12 shrink-0" />
              ) : (
                <div
                  className={`grid h-12 w-12 place-items-center rounded-full ${item.iconBg} ${item.iconColor}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              )}
              <div>
                <AnimatedStatValue value={item.value} />
                <p className="mt-2 text-[13px] text-[#6f778b]">{item.label}</p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function buildCandidatesStats(params: {
  totalCandidates: number;
  stuckCandidates: number;
  pendingCandidates: number;
  approvedCandidates: number;
}): CandidateStat[] {
  return [
    {
      value: String(params.totalCandidates),
      label: "Total Candidates",
      icon: Users,
      iconColor: "text-[var(--color-stat-candidates-icon)]",
      iconBg: "bg-[var(--color-stat-candidates-bg)]",
    },
    {
      value: String(params.stuckCandidates),
      label: "Stuck Candidates",
      icon: ClipboardList,
      iconColor: "text-[var(--color-stat-pending-icon)]",
      iconBg: "bg-[var(--color-stat-pending-bg)]",
    },
    {
      value: String(params.pendingCandidates),
      label: "Pending Reviews",
      icon: ClipboardList,
      iconColor: "text-[var(--color-stat-pending-icon)]",
      iconBg: "bg-[var(--color-stat-pending-bg)]",
    },
    {
      value: String(params.approvedCandidates),
      label: "Approved",
      icon: CircleCheckBig,
      iconColor: "text-[var(--color-stat-approved-icon)]",
      iconBg: "bg-[var(--color-stat-approved-bg)]",
    },
  ];
}
