"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";
import { useGetAdminSubmissionsQuery } from "@/features/dashboard/dashboard.api";
import type { AdminSubmission, DashboardTone } from "@/types/dashboard";

const avatarToneClasses: Record<string, string> = {
  indigo: "bg-[#4f46e5]",
  orange: "bg-[#f59e0b]",
  cyan: "bg-[#06b6d4]",
  teal: "bg-[#14b8a6]",
  purple: "bg-[#8b5cf6]",
};

const statusToneClasses: Record<DashboardTone, string> = {
  success: "bg-[#e8faec] text-[#12aa5f]",
  warning: "bg-[#fff4df] text-[#f0a112]",
  danger: "bg-[#ffefeb] text-[#ff5c38]",
  info: "bg-[#eaf4ff] text-[#1c76d2]",
};

function normalizeDashboardUrl(url: string) {
  return url.replace(/^\/admin/, "/dashboard");
}

function splitSubmittedLabel(value: string) {
  const parts = value.trim().split(" ");

  if (parts.length < 5) {
    return {
      date: value,
      time: "",
    };
  }

  return {
    date: parts.slice(0, 3).join(" "),
    time: parts.slice(3).join(" "),
  };
}

function SubmissionRow({ row }: { row: AdminSubmission }) {
  const submitted = splitSubmittedLabel(row.submittedAtLabel);

  return (
    <div className="grid grid-cols-[1.7fr_1.15fr_0.9fr_0.55fr] gap-4 border-b border-dashed border-[#d9e1ee] px-4 py-2.5 last:border-b-0">
      <div className="flex items-center gap-3">
        <div
          className={`grid h-7 w-7 place-items-center rounded-full text-[12px] font-medium text-white ${
            avatarToneClasses[row.candidate.avatarTone] ?? "bg-[#18acd6]"
          }`}
        >
          {row.candidate.initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] text-[#4954a6]">
            {row.candidate.name}
          </p>
          <p className="mt-1 truncate text-[11px] text-[#8f9ab2]">
            {row.bookingNumber}
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[13px] text-[#4954a6]">{submitted.date}</p>
        <p className="mt-1 text-[11px] text-[#8f9ab2]">
          {submitted.time || row.submittedRelative}
        </p>
      </div>

      <div className="flex items-center justify-center">
        <span
          className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${
            statusToneClasses[row.status.tone]
          }`}
        >
          {row.status.label}
        </span>
      </div>

      <div className="flex items-center justify-center text-[#7079a2]">
        <Link
          href={normalizeDashboardUrl(row.action.url)}
          aria-label={`View booking details for ${row.candidate.name}`}
          className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-[#f5f9ff]"
        >
          <Eye className="h-4.5 w-4.5" />
        </Link>
      </div>
    </div>
  );
}

export function RecentSubmissionsCard() {
  const { data, isLoading, isError } = useGetAdminSubmissionsQuery({
    page: 1,
    limit: 10,
  });
  const submissions = data?.data.submissions ?? [];

  return (
    <DashboardSectionCard
      title="Recent Submissions"
      actionLabel="View All"
      className="h-full"
    >
      {isError ? (
        <div className="rounded-2xl border border-[#ffd7db] bg-[#fff2f4] px-4 py-3 text-sm text-[#c5394f]">
          We could not load recent submissions right now. Please try again.
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-[#e8eef8] bg-white px-4 py-10 text-center text-sm text-[#6f778b]">
          Loading recent submissions...
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="rounded-2xl border border-[#e8eef8] bg-white">
          <div className="grid grid-cols-[1.7fr_1.15fr_0.9fr_0.55fr] gap-4 border-b border-[#edf2fa] px-4 py-3 text-[13px] font-semibold text-[#4d5570]">
            <div className="border-r border-[#d7deeb] pr-4">Candidate</div>
            <div className="border-r border-[#d7deeb] pr-4 text-center">
              Submitted
            </div>
            <div className="text-center">Status</div>
            <div className="text-center">Actions</div>
          </div>

          <div>
            {submissions.map((row) => (
              <SubmissionRow key={row.id} row={row} />
            ))}

            {submissions.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-[#7a86a4]">
                No submissions found.
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </DashboardSectionCard>
  );
}
