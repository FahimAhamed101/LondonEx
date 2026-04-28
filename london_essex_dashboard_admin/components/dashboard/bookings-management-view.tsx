"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Filter } from "lucide-react";
import {
  useGetAdminBookingsQuery,
  useGetAdminCoursesQuery,
} from "@/features/dashboard/dashboard.api";
import type { DashboardTone } from "@/types/dashboard";

const statusClasses: Record<DashboardTone, string> = {
  success: "bg-[#e8faef] text-[#11ae66]",
  warning: "bg-[#fff4df] text-[#f0a112]",
  danger: "bg-[#ffefeb] text-[#ff5c38]",
  info: "bg-[#eaf4ff] text-[#1c76d2]",
};

function normalizeDashboardUrl(url: string) {
  return url.replace(/^\/admin/, "/dashboard");
}

export function BookingsManagementView() {
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedCourse, setSelectedCourse] = useState("All Course");
  const { data, isLoading, isError } = useGetAdminBookingsQuery({
    page: 1,
    limit: 10,
    tab: "upcoming",
  });
  const { data: coursesData } = useGetAdminCoursesQuery({
    page: 1,
    limit: 100,
  });
  const statusOptions = useMemo(
    () => {
      const bookings = data?.data.bookings ?? [];
      return [
        "All Statuses",
        ...new Set(bookings.map((booking) => booking.statusBadge.label)),
      ];
    },
    [data?.data.bookings],
  );
  const courseOptions = useMemo(
    () => {
      const bookings = data?.data.bookings ?? [];
      const courseTitles = [
        ...(coursesData?.data.courses.map((course) => course.title) ?? []),
        ...bookings.map((booking) => booking.course.title),
      ];

      return [
        "All Course",
        ...new Set(courseTitles),
      ];
    },
    [coursesData?.data.courses, data?.data.bookings],
  );

  const filteredRows = useMemo(() => {
    const bookings = data?.data.bookings ?? [];

    return bookings.filter((row) => {
      const matchesStatus =
        selectedStatus === "All Statuses" ||
        row.statusBadge.label === selectedStatus;
      const matchesCourse =
        selectedCourse === "All Course" || row.course.title === selectedCourse;

      return matchesStatus && matchesCourse;
    });
  }, [data?.data.bookings, selectedCourse, selectedStatus]);

  const visibleRows = filteredRows.slice(0, 10);

  return (
    <section className="rounded-[18px] border border-[#dbe7f8] bg-[#fbfdff] p-4 shadow-[0_12px_32px_rgba(22,43,120,0.04)] sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[22px] font-semibold text-[#31439f]">
          Bookings
        </h1>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative inline-flex min-w-[154px] items-center">
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#5c68b2]" />
            <select
              value={selectedCourse}
              onChange={(event) => setSelectedCourse(event.target.value)}
              className="h-11 w-full appearance-none rounded-[12px] border border-[#e2eaf7] bg-white pl-11 pr-10 text-[14px] font-semibold text-[#4f5cb0] outline-none transition focus:border-[#8fcdf0]"
            >
              {courseOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="relative inline-flex min-w-[154px] items-center">
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#5c68b2]" />
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="h-11 w-full appearance-none rounded-[12px] border border-[#e2eaf7] bg-white pl-11 pr-10 text-[14px] font-semibold text-[#4f5cb0] outline-none transition focus:border-[#8fcdf0]"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {isError ? (
        <div className="mt-4 rounded-[14px] border border-[#ffd7db] bg-[#fff2f4] px-4 py-3 text-sm text-[#c5394f]">
          We could not load bookings right now. Please try again.
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-4 rounded-[14px] border border-[#d4e4fb] bg-[#fbfdff] px-4 py-10 text-center text-sm text-[#6f778b]">
          Loading bookings...
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="mt-4 overflow-hidden rounded-[16px] border border-[#dfe9f8]">
          <div className="overflow-x-auto">
            <div className="min-w-[940px]">
              <div className="grid grid-cols-[1.25fr_1.3fr_0.9fr_0.75fr_0.45fr] gap-4 border-b border-[#dbe4f3] bg-[#f6faff] px-4 py-4 text-[13px] font-semibold text-[#4c567b]">
                <div className="border-r border-[#d3ddec] pr-4">Candidate</div>
                <div className="border-r border-[#d3ddec] pr-4">
                  Enrolled Course
                </div>
                <div className="border-r border-[#d3ddec] pr-4 text-center">
                  Session
                </div>
                <div className="border-r border-[#d3ddec] pr-4 text-center">
                  Status
                </div>
                <div className="text-center">Actions</div>
              </div>

              {visibleRows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[1.25fr_1.3fr_0.9fr_0.75fr_0.45fr] gap-4 border-t border-dashed border-[#d8e3f4] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#18acd6] text-[12px] font-medium text-white">
                      {row.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[#4b59a8]">
                        {row.user.name}
                      </p>
                      <p className="mt-1 truncate text-[11px] text-[#8d99b5]">
                        {row.bookingNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-[13px] font-medium text-[#3e4ea3]">
                    <p>{row.course.title}</p>
                    <p className="mt-1 text-[11px] text-[#8d99b5]">
                      {row.course.displayPrice}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-[13px] font-medium text-[#4b59a8]">
                      {row.session.displayDate}
                    </p>
                    <p className="mt-1 text-[11px] text-[#8d99b5]">
                      {row.session.displayTime}
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <span
                      className={`rounded-[6px] px-2.5 py-1 text-[12px] font-medium ${statusClasses[row.statusBadge.tone]}`}
                    >
                      {row.statusBadge.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-center">
                    <Link
                      href={normalizeDashboardUrl(row.actions.view.url)}
                      className="grid h-8 w-8 place-items-center rounded-full text-[#7079a2] transition hover:bg-[#f5f9ff]"
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </Link>
                  </div>
                </div>
              ))}

              {visibleRows.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-[#7b88a5]">
                  No bookings found for the selected filters.
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#e7eef8] px-4 py-4 text-[14px] text-[#5e6ba7] md:flex-row md:items-center md:justify-end">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <span className="font-medium text-[#3948a0]">10</span>
            </div>
            <span>
              1-{visibleRows.length} of {filteredRows.length}
            </span>
            <div className="flex items-center gap-3 text-[#6a78ad]">
              <button
                type="button"
                className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-[#f5f9ff]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-[#f5f9ff]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
