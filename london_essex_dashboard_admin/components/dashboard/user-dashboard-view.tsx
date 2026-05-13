"use client";

import Link from "next/link";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  FileText,
  PenLine,
  ReceiptText,
  UserRoundPlus,
} from "lucide-react";
import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";
import { useGetUserDashboardQuery } from "@/features/dashboard/dashboard.api";
import type {
  DashboardTone,
  UserDashboardActivity,
  UserDashboardBooking,
  UserDashboardEmptyState,
  UserDashboardTaskCard,
  UserDashboardUpcomingBooking,
} from "@/types/dashboard";

const statusToneClasses: Record<DashboardTone, string> = {
  success: "bg-[#eaf9ef] text-[#14a563]",
  warning: "bg-[#fff4df] text-[#e89b16]",
  danger: "bg-[#ffefeb] text-[#e65235]",
  info: "bg-[#eef4ff] text-[#5262d9]",
};

const activityToneClasses: Record<DashboardTone, string> = {
  success: "bg-[#ecfbf2] text-[#15a865]",
  warning: "bg-[#fff5df] text-[#e89b16]",
  danger: "bg-[#fff0ec] text-[#e65235]",
  info: "bg-[#eef2ff] text-[#5d6cf4]",
};

const activityIcons: Record<string, typeof UserRoundPlus> = {
  user_registration: UserRoundPlus,
  payment_received: ReceiptText,
  payment_failed: AlertCircle,
  booking_confirmed: CheckCircle2,
  booking_created: CalendarClock,
  booking_cancelled: AlertCircle,
};

function toDashboardUrl(url: string, fallback = "/dashboard/bookings") {
  if (!url) {
    return fallback;
  }

  if (url.startsWith("/bookings")) {
    return `/dashboard${url}`;
  }

  if (url.startsWith("/courses")) {
    return "/dashboard/courses";
  }

  return url;
}

function TaskStatusIcon({ card }: { card: UserDashboardTaskCard }) {
  const isDocuments = card.id === "documents";
  const Icon = isDocuments ? FileText : PenLine;
  const toneClass =
    card.status.tone === "success"
      ? "bg-[#ecfbf2] text-[#12a862]"
      : "bg-[#fff5e6] text-[#f0a11a]";

  return (
    <div
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${toneClass}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </div>
  );
}

function LoadingPanel() {
  return (
    <div className="rounded-xl border border-[#e4edf8] bg-white px-4 py-10 text-center text-sm text-[#7a86a4]">
      Loading dashboard...
    </div>
  );
}

function ErrorPanel() {
  return (
    <div className="rounded-xl border border-[#ffd7db] bg-[#fff2f4] px-4 py-4 text-sm text-[#c5394f]">
      We could not load your dashboard right now. Please try again.
    </div>
  );
}

function RunningCourseEmpty({ emptyState }: { emptyState: UserDashboardEmptyState }) {
  return (
    <div className="grid min-h-[184px] place-items-center rounded-xl border border-[#e2eaf7] bg-white px-5 py-8 text-center">
      <div>
        <CalendarClock className="mx-auto h-9 w-9 text-[#5262d9]" />
        <h3 className="mt-4 text-[22px] font-semibold text-[#5262d9]">
          {emptyState.title}
        </h3>
        <p className="mt-2 max-w-[420px] text-sm leading-6 text-[#7b86a2]">
          {emptyState.description}
        </p>
        {emptyState.cta ? (
          <Link
            href={toDashboardUrl(emptyState.cta.url, "/dashboard/courses")}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[#1ea6df] px-5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(30,166,223,0.22)]"
          >
            {emptyState.cta.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function RunningTaskCard({ card }: { card: UserDashboardTaskCard }) {
  return (
    <article className="flex min-h-[72px] items-start gap-3 rounded-lg border border-[#e2eaf7] bg-white px-4 py-3">
      <TaskStatusIcon card={card} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-[#4551ae]">
          {card.label}
        </p>
        <p className="mt-1 text-[11px] text-[#7f8aa6]">{card.summary}</p>
        <Link
          href={toDashboardUrl(card.action.url)}
          className="mt-2 inline-flex text-[11px] font-semibold text-[#1aa7df]"
        >
          {card.action.label} -&gt;
        </Link>
      </div>
    </article>
  );
}

function RunningCourseCard({ booking }: { booking: UserDashboardBooking }) {
  const progressWidth = `${Math.max(0, Math.min(100, booking.progress.percentage))}%`;

  return (
    <div className="rounded-xl border border-[#e1eaf7] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-[#3542a3]">
            {booking.progress.title}
          </h3>
          <p className="mt-2 text-[12px] font-medium text-[#5262d9]">
            {booking.progress.trackLabel}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
            statusToneClasses[booking.progress.status.tone]
          }`}
        >
          {booking.progress.status.label}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[12px]">
          <span className="text-[#8994ad]">Progress</span>
          <span className="font-semibold text-[#1ea6df]">
            {booking.progress.percentageLabel}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[#e8f0f8]">
          <div
            className="h-full rounded-full bg-[#23a9df]"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-[#7d89a5]">{booking.progress.description}</p>
        <Link
          href={toDashboardUrl(booking.action.url)}
          className="inline-flex h-9 items-center justify-center rounded-md bg-[#1ea6df] px-6 text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(30,166,223,0.25)]"
        >
          {booking.action.label}
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <RunningTaskCard card={booking.cards.documents} />
        <RunningTaskCard card={booking.cards.signatures} />
      </div>
    </div>
  );
}

function UpcomingCourseCard({
  booking,
}: {
  booking: UserDashboardUpcomingBooking;
}) {
  return (
    <div className="rounded-xl border border-[#e2eaf7] bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-[#3542a3]">
            {booking.course.title}
          </h3>
          <p className="mt-2 text-[12px] text-[#7f8aa6]">
            {booking.session.displayDateTime || booking.course.schedule}
          </p>
          <p className="mt-1 text-[12px] text-[#7f8aa6]">
            {booking.session.location || booking.course.location}
          </p>
        </div>
        <Link
          href={toDashboardUrl(booking.action.url)}
          className="inline-flex h-9 items-center justify-center rounded-md border border-[#dbe7f8] bg-[#f7fbff] px-5 text-[12px] font-semibold text-[#3542a3]"
        >
          {booking.action.label}
        </Link>
      </div>
    </div>
  );
}

function UpcomingCourseEmpty({
  emptyState,
}: {
  emptyState: UserDashboardEmptyState;
}) {
  return (
    <div className="grid min-h-[170px] place-items-center rounded-xl border border-[#e2eaf7] bg-white px-5 py-8 text-center">
      <div>
        <CalendarClock className="mx-auto h-10 w-10 text-[#5262d9]" />
        <h3 className="mt-4 text-[25px] font-semibold text-[#5262d9]">
          {emptyState.title}
        </h3>
      </div>
    </div>
  );
}

function ActivityItem({ item }: { item: UserDashboardActivity }) {
  const Icon = activityIcons[item.type] ?? UserRoundPlus;

  return (
    <article className="flex items-start gap-3 rounded-xl border border-[#e9eff8] bg-white px-4 py-3">
      <div
        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
          activityToneClasses[item.tone]
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-[12px] font-semibold text-[#3542a3]">
            {item.title}
          </p>
          <span className="shrink-0 text-[10px] text-[#9aa4b7]">
            {item.relativeTime}
          </span>
        </div>
        <p className="mt-1 truncate text-[11px] text-[#7f8aa6]">
          {item.description}
        </p>
      </div>
    </article>
  );
}

export function UserDashboardView() {
  const { data, isLoading, isError } = useGetUserDashboardQuery();
  const dashboard = data?.data.dashboard;

  if (isError) {
    return <ErrorPanel />;
  }

  if (isLoading || !dashboard) {
    return <LoadingPanel />;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <DashboardSectionCard title={dashboard.runningCourse.title}>
          {dashboard.runningCourse.booking ? (
            <RunningCourseCard booking={dashboard.runningCourse.booking} />
          ) : dashboard.runningCourse.emptyState ? (
            <RunningCourseEmpty emptyState={dashboard.runningCourse.emptyState} />
          ) : null}
        </DashboardSectionCard>

        <DashboardSectionCard title={dashboard.upcomingCourse.title}>
          {dashboard.upcomingCourse.booking ? (
            <UpcomingCourseCard booking={dashboard.upcomingCourse.booking} />
          ) : dashboard.upcomingCourse.emptyState ? (
            <UpcomingCourseEmpty emptyState={dashboard.upcomingCourse.emptyState} />
          ) : null}
        </DashboardSectionCard>
      </div>

      <DashboardSectionCard title={dashboard.recentActivity.title} className="h-full">
        <div className="space-y-3">
          {dashboard.recentActivity.items.map((item) => (
            <ActivityItem key={item.id} item={item} />
          ))}

          {dashboard.recentActivity.items.length === 0 &&
          dashboard.recentActivity.emptyState ? (
            <div className="rounded-xl border border-[#e2eaf7] bg-white px-4 py-10 text-center">
              <p className="text-sm font-semibold text-[#3542a3]">
                {dashboard.recentActivity.emptyState.title}
              </p>
              <p className="mt-2 text-xs leading-5 text-[#7f8aa6]">
                {dashboard.recentActivity.emptyState.description}
              </p>
            </div>
          ) : null}
        </div>
      </DashboardSectionCard>
    </div>
  );
}
