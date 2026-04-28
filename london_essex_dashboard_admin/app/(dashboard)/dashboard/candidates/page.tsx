 "use client";

import {
  buildCandidatesStats,
  CandidatesStatsRow,
} from "@/components/dashboard/candidates-stats-row";
import { CandidatesTableCard } from "@/components/dashboard/candidates-table-card";
import { useGetAdminCandidatesQuery } from "@/features/dashboard/dashboard.api";

export default function CandidatesPage() {
  const { data, isLoading, isError } = useGetAdminCandidatesQuery({
    page: 1,
    limit: 10,
    sortBy: "submitted",
    sortOrder: "desc",
  });
  const candidates = data?.data.candidates ?? [];
  const summary = data?.data.summary;
  const stats = buildCandidatesStats({
    totalCandidates: summary?.totalCandidates ?? 0,
    stuckCandidates: summary?.stuckCandidates ?? 0,
    pendingCandidates: candidates.filter(
      (candidate) => candidate.bookingStatus.key === "pending",
    ).length,
    approvedCandidates: candidates.filter(
      (candidate) => candidate.bookingStatus.key === "approved",
    ).length,
  });

  return (
    <div className="space-y-5">
      {isError ? (
        <div className="rounded-[14px] border border-[#ffd7db] bg-[#fff2f4] px-4 py-3 text-sm text-[#c5394f]">
          We could not load the candidates right now. Please try again.
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[14px] border border-[#d4e4fb] bg-[#fbfdff] px-4 py-10 text-center text-sm text-[#6f778b]">
          Loading candidates...
        </div>
      ) : null}

      {!isLoading ? (
        <>
          <CandidatesStatsRow stats={stats} />
          <CandidatesTableCard rows={candidates} />
        </>
      ) : null}
    </div>
  );
}
