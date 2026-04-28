"use client";

import { use } from "react";
import { CandidateDetailsView } from "@/components/dashboard/candidate-details-view";
import { useGetAdminCandidateByIdQuery } from "@/features/dashboard/dashboard.api";

export default function CandidateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useGetAdminCandidateByIdQuery(id);
  const candidate = data?.data.candidate;

  if (isLoading) {
    return (
      <div className="rounded-[14px] border border-[#d4e4fb] bg-[#fbfdff] px-4 py-10 text-center text-sm text-[#6f778b]">
        Loading candidate details...
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <div className="rounded-[14px] border border-[#ffd7db] bg-[#fff2f4] px-4 py-3 text-sm text-[#c5394f]">
        We could not load this candidate right now. Please try again.
      </div>
    );
  }

  return <CandidateDetailsView candidate={candidate} />;
}
