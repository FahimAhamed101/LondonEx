"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useGetProfileQuery } from "@/features/auth/auth.api";
import { useAppSelector } from "@/lib/redux";

export function useAuthenticatedUser() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const storedUser = useAppSelector((state) => state.auth.user);
  const { data, isFetching, isLoading, isError } = useGetProfileQuery(
    accessToken ? undefined : skipToken,
  );

  return {
    user: data?.data.user ?? storedUser,
    isLoading: Boolean(accessToken) && (isLoading || isFetching),
    isError: Boolean(accessToken) && isError,
  };
}
