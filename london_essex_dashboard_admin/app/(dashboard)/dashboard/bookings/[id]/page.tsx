"use client";

import { use } from "react";
import { BookingDetailsView } from "@/components/dashboard/booking-details-view";
import { useGetAdminBookingByIdQuery } from "@/features/dashboard/dashboard.api";

export default function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useGetAdminBookingByIdQuery(id);
  const booking = data?.data.booking;

  if (isLoading) {
    return (
      <div className="rounded-[14px] border border-[#d4e4fb] bg-[#fbfdff] px-4 py-10 text-center text-sm text-[#6f778b]">
        Loading booking details...
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="rounded-[14px] border border-[#ffd7db] bg-[#fff2f4] px-4 py-3 text-sm text-[#c5394f]">
        We could not load this booking right now. Please try again.
      </div>
    );
  }

  return <BookingDetailsView booking={booking} />;
}
