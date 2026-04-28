import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { API_BASE_URL, API_TIMEOUT_MESSAGE } from "@/lib/api/api-config";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth?: { accessToken: string | null } }).auth
      ?.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("accept", "application/json");

    return headers;
  },
});

const baseQueryWithDefaults: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === "FETCH_ERROR") {
    return {
      error: {
        ...result.error,
        error: API_TIMEOUT_MESSAGE,
      },
    };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithDefaults,
  tagTypes: ["Auth", "Profile", "Courses", "Bookings"],
  endpoints: () => ({}),
});
