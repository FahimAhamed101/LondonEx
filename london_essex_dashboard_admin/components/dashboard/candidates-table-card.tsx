"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";
import { useGetAdminCoursesQuery } from "@/features/dashboard/dashboard.api";
import type { AdminCandidate } from "@/types/dashboard";

const ROWS_PER_PAGE = 10;
const avatarToneClasses: Record<string, string> = {
  indigo: "bg-[#4f46e5]",
  orange: "bg-[#f59e0b]",
  cyan: "bg-[#06b6d4]",
  teal: "bg-[#14b8a6]",
  purple: "bg-[#8b5cf6]",
};

function getProgressClasses(progress: number) {
  if (progress >= 80) {
    return {
      bar: "bg-[#10a56b]",
      text: "text-[#10a56b]",
    };
  }

  if (progress >= 60) {
    return {
      bar: "bg-[#18acd6]",
      text: "text-[#33469c]",
    };
  }

  if (progress >= 35) {
    return {
      bar: "bg-[#ffaf11]",
      text: "text-[#33469c]",
    };
  }

  return {
    bar: "bg-[#ff6134]",
    text: "text-[#33469c]",
  };
}

function normalizeDashboardUrl(url: string) {
  return url.replace(/^\/admin/, "/dashboard");
}

type CandidatesTableCardProps = {
  rows?: AdminCandidate[];
};

export function CandidatesTableCard({
  rows = [],
}: CandidatesTableCardProps) {
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [search, setSearch] = useState("");
  const [animateBars, setAnimateBars] = useState(false);
  const [stuckOnly, setStuckOnly] = useState(false);
  const [selectedReminderRowId, setSelectedReminderRowId] = useState<
    string | null
  >(null);
  const deferredSearch = useDeferredValue(search);
  const { data: coursesData } = useGetAdminCoursesQuery({
    page: 1,
    limit: 100,
  });
  const courseOptions = useMemo(() => {
    const courseTitles = [
      ...(coursesData?.data.courses.map((course) => course.title) ?? []),
      ...rows.map((row) => row.enrolledCourse.title),
    ];

    return ["All Courses", ...new Set(courseTitles)];
  }, [coursesData?.data.courses, rows]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimateBars(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const filteredRows = rows.filter((row) => {
    const matchesCourse =
      selectedCourse === "All Courses" ||
      row.enrolledCourse.title === selectedCourse;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      row.candidate.name.toLowerCase().includes(normalizedSearch) ||
      row.enrolledCourse.title.toLowerCase().includes(normalizedSearch) ||
      row.candidate.candidateNumber.toLowerCase().includes(normalizedSearch) ||
      row.candidate.email.toLowerCase().includes(normalizedSearch);
    const matchesStuck = !stuckOnly || row.isStuck;

    return matchesCourse && matchesSearch && matchesStuck;
  });

  const visibleRows = filteredRows.slice(0, ROWS_PER_PAGE);
  const selectedReminderRow =
    rows.find((row) => row.id === selectedReminderRowId) ?? null;

  return (
    <>
      <DashboardSectionCard title="Candidates" className="p-3.5 sm:p-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
            <label className="relative block w-full md:max-w-[220px]">
              <select
                value={selectedCourse}
                onChange={(event) => setSelectedCourse(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#d6e6f2] bg-white px-4 pr-10 text-sm text-[#33469c] outline-none transition focus:border-[var(--color-border-focus)]"
              >
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              <ChevronRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#8ea0c8]" />
            </label>

            <label className="relative block w-full md:max-w-[220px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ea0c8]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                className="h-11 w-full rounded-xl border border-[#d6e6f2] bg-white pl-11 pr-4 text-sm text-[#33469c] outline-none transition placeholder:text-[#9da8b8] focus:border-[var(--color-border-focus)]"
              />
            </label>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d6e6f2] bg-white px-4 text-sm font-medium text-[#33469c] transition hover:bg-[#f7fbff]"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#e0e8f4] bg-white">
            <div className="overflow-x-auto">
              <div className="min-w-[920px]">
                <div className="grid grid-cols-[1.55fr_1.45fr_1.3fr_1.2fr_0.7fr] gap-3 border-b border-[#e7eef8] bg-[#f2f7fd] px-4 py-3 text-[14px] font-semibold text-[#5a6789]">
                  <div className="border-r border-[#d7deeb] pr-3">Name</div>
                  <div className="border-r border-[#d7deeb] pr-3">
                    Enrolled Course
                  </div>
                  <div className="border-r border-[#d7deeb] pr-3">Progress</div>
                  <div className="border-r border-[#d7deeb] pr-3">Submitted</div>
                  <div className="text-center">Actions</div>
                </div>

                <div className="max-h-[430px] overflow-y-auto">
                  {visibleRows.map((row) => {
                    const progressStyles = getProgressClasses(
                      row.progress.percentage,
                    );

                    return (
                      <div
                        key={row.id}
                        className="grid grid-cols-[1.55fr_1.45fr_1.3fr_1.2fr_0.7fr] gap-3 border-b border-dashed border-[#d9e1ee] px-4 py-3 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`grid h-7 w-7 place-items-center rounded-full text-[12px] font-medium text-white ${
                              avatarToneClasses[row.candidate.avatarTone] ??
                              "bg-[#18acd6]"
                            }`}
                          >
                            {row.candidate.initial}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[18px] text-[#33469c]">
                              {row.candidate.name}
                            </p>
                            <p className="mt-1 text-[13px] text-[#8f9ab2]">
                              {row.candidate.candidateNumber}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <p className="text-[16px] text-[#4954a6]">
                            {row.enrolledCourse.title}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="h-1.5 flex-1 rounded-full bg-[#f7e8db]">
                            <div
                              className={`h-full rounded-full transition-[width] duration-700 ease-out ${progressStyles.bar}`}
                              style={{
                                width: animateBars
                                  ? `${row.progress.percentage}%`
                                  : "0%",
                              }}
                            />
                          </div>
                          <span
                            className={`min-w-[52px] text-right text-[14px] ${progressStyles.text}`}
                          >
                            {row.progress.label}
                          </span>
                        </div>

                        <div>
                          <p className="text-[16px] text-[#4954a6]">
                            {row.submittedAtLabel}
                          </p>
                          <p className="mt-1 text-[13px] text-[#8f9ab2]">
                            {row.bookingStatus.label}
                          </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-[#5060b5]">
                          <button
                            type="button"
                            onClick={() => setSelectedReminderRowId(row.id)}
                            className="grid h-8 w-8 place-items-center rounded-md border border-[#d7e5f7] bg-white transition hover:bg-[#f6faff]"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          <Link
                            href={normalizeDashboardUrl(row.actions.view.url)}
                            className="grid h-8 w-8 place-items-center rounded-md border border-[#d7e5f7] bg-white transition hover:bg-[#f6faff]"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}

                  {visibleRows.length === 0 ? (
                    <div className="px-4 py-10 text-center text-sm text-[#7a86a4]">
                      No candidates found for this search.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#edf2fa] px-4 py-3 text-[14px] text-[#6a77a0] md:flex-row md:items-center md:justify-between">
              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={stuckOnly}
                  onChange={(event) => setStuckOnly(event.target.checked)}
                  className="h-4 w-4 rounded border-[#cfdcf2] text-[#1ea6df]"
                />
                <span>Stuck candidates</span>
              </label>

              <div className="flex flex-wrap items-center gap-4 md:justify-end">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <span className="inline-flex items-center gap-1 text-[#33469c]">
                    {ROWS_PER_PAGE}
                    <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                  </span>
                </div>
                <span>
                  1-10 of {filteredRows.length === 0 ? 0 : filteredRows.length}
                </span>
                <div className="flex items-center gap-2 text-[#5060b5]">
                  <button
                    type="button"
                    className="grid h-7 w-7 place-items-center"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="grid h-7 w-7 place-items-center"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSectionCard>

      {selectedReminderRow ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#12214d]/35 px-4 py-8 backdrop-blur-[2px]">
          <div className="w-full max-w-[840px] rounded-[20px] border border-[#d6e6f2] bg-[#f8fcff] p-5 shadow-[0_24px_60px_rgba(18,33,77,0.18)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[20px] font-medium text-[#33469c]">
                  Upcoming Course
                </h3>
                <p className="mt-2 text-base text-[#33469c]">Upcoming Course</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReminderRowId(null)}
                className="grid h-10 w-10 place-items-center rounded-full text-[#33469c] transition hover:bg-white"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            <div className="mt-6 rounded-[18px] border border-[#e0e8f4] bg-[#f7f7ff] px-5 py-5 sm:px-6">
              <p className="text-[17px] text-[#33469c]">
                Dear {selectedReminderRow.candidate.name},
              </p>
              <p className="mt-6 max-w-[700px] text-[17px] leading-9 text-[#33469c]">
                This is a friendly reminder to complete your registration for{" "}
                {selectedReminderRow.enrolledCourse.title}. Your current
                progress is {selectedReminderRow.progress.label}. Please log in
                to continue.
              </p>
              <p className="mt-6 text-[17px] leading-9 text-[#33469c]">
                Best regards,
                <br />
                Admin Team
              </p>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedReminderRowId(null)}
                className="inline-flex h-[52px] min-w-[136px] items-center justify-center rounded-[14px] border border-[#e0e8f4] bg-white px-7 text-[17px] font-semibold text-[#222831] shadow-[0_8px_18px_rgba(17,24,39,0.06)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  window.open(selectedReminderRow.actions.message.url, "_blank")
                }
                className="inline-flex h-[52px] min-w-[260px] items-center justify-center gap-3 rounded-[14px] bg-[var(--color-action-primary)] px-7 text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(11,168,221,0.28)] transition hover:bg-[var(--color-action-primary-hover)]"
              >
                <Mail className="h-5 w-5" />
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
