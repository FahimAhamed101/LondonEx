import { baseApi } from "@/lib/api/base-api";
import type { ApiResponse } from "@/features/auth/auth.types";
import type {
  AdminBookingDetailResponse,
  AdminBookingsResponse,
  AdminCandidateDetailResponse,
  AdminCourseDetailResponse,
  AdminCoursesResponse,
  CreateAdminCourseRequest,
  CourseSourceOptionsResponse,
  AdminSubmissionsResponse,
  AdminCandidatesResponse,
  CandidateReminderResult,
  UpdateAdminBookingRequest,
  UpdateAdminCourseRequest,
  StuckCandidateReminderResponse,
  SaveRegistrationEligibilityRequest,
  SaveRegistrationAssessmentRequest,
  SaveRegistrationEmployerRequest,
  SaveRegistrationTrainingRequest,
  SaveRegistrationPrivacyRequest,
  MockRegistrationDataResponse,
  Am2ChecklistFlowResponse,
  Am2eChecklistFlowResponse,
  Am2eV1ChecklistFlowResponse,
  BookingDocumentsFlowResponse,
  UserDashboardResponse,
} from "@/types/dashboard";

export const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getUserDashboard: builder.query<ApiResponse<UserDashboardResponse>, void>({
      query: () => ({
        url: "/bookings/dashboard",
        method: "GET",
      }),
      providesTags: ["Bookings"],
    }),
    getAdminCandidates: builder.query<
      ApiResponse<AdminCandidatesResponse>,
      {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: string;
      } | void
    >({
      query: (params) => ({
        url: "/admin/candidates",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          sortBy: params?.sortBy ?? "submitted",
          sortOrder: params?.sortOrder ?? "desc",
        },
      }),
    }),
    getAdminBookings: builder.query<
      ApiResponse<AdminBookingsResponse>,
      {
        page?: number;
        limit?: number;
        tab?: "upcoming" | "past" | "cancelled";
      } | void
    >({
      query: (params) => ({
        url: "/admin/bookings",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          tab: params?.tab ?? "upcoming",
        },
      }),
      providesTags: ["Bookings"],
    }),
    getAdminBookingById: builder.query<
      ApiResponse<AdminBookingDetailResponse>,
      string
    >({
      query: (bookingId) => ({
        url: `/admin/bookings/${bookingId}`,
        method: "GET",
      }),
      providesTags: ["Bookings"],
    }),
    getAdminCandidateById: builder.query<
      ApiResponse<AdminCandidateDetailResponse>,
      string
    >({
      query: (candidateId) => ({
        url: `/admin/candidates/${candidateId}`,
        method: "GET",
      }),
    }),
    getAdminSubmissions: builder.query<
      ApiResponse<AdminSubmissionsResponse>,
      {
        page?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({
        url: "/admin/submissions",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),
    }),
    getAdminCourses: builder.query<
      ApiResponse<AdminCoursesResponse>,
      {
        page?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({
        url: "/admin/courses",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),
      providesTags: ["Courses"],
    }),
    getAdminCourseById: builder.query<
      ApiResponse<AdminCourseDetailResponse>,
      string
    >({
      query: (courseId) => ({
        url: `/admin/courses/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),
    getCourseSourceOptions: builder.query<
      ApiResponse<CourseSourceOptionsResponse>,
      void
    >({
      query: () => ({
        url: "/admin/courses/options",
        method: "GET",
      }),
    }),
    createAdminCourse: builder.mutation<
      ApiResponse<AdminCourseDetailResponse>,
      CreateAdminCourseRequest
    >({
      query: (body) => ({
        url: "/admin/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),
    updateAdminCourse: builder.mutation<
      ApiResponse<AdminCourseDetailResponse>,
      { courseId: string; body: UpdateAdminCourseRequest }
    >({
      query: ({ courseId, body }) => ({
        url: `/admin/courses/${courseId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),
    updateAdminBooking: builder.mutation<
      ApiResponse<AdminBookingDetailResponse>,
      { bookingId: string; body: UpdateAdminBookingRequest }
    >({
      query: ({ bookingId, body }) => ({
        url: `/admin/bookings/${bookingId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),
    sendCandidateReminder: builder.mutation<
      ApiResponse<CandidateReminderResult>,
      string
    >({
      query: (candidateId) => ({
        url: `/admin/candidates/${candidateId}/reminder`,
        method: "POST",
      }),
    }),
    sendStuckCandidateReminders: builder.mutation<
      ApiResponse<StuckCandidateReminderResponse>,
      void
    >({
      query: () => ({
        url: `/admin/candidates/stuck/reminders`,
        method: "POST",
      }),
    }),
    saveRegistrationEligibility: builder.mutation<
      ApiResponse<AdminBookingDetailResponse>,
      { bookingId: string; body: SaveRegistrationEligibilityRequest }
    >({
      query: ({ bookingId, body }) => ({
        url: `/bookings/${bookingId}/registration/eligibility`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),
    saveRegistrationAssessment: builder.mutation<
      ApiResponse<AdminBookingDetailResponse>,
      { bookingId: string; body: SaveRegistrationAssessmentRequest }
    >({
      query: ({ bookingId, body }) => ({
        url: `/bookings/${bookingId}/registration/assessment`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),
    saveRegistrationEmployer: builder.mutation<
      ApiResponse<AdminBookingDetailResponse>,
      { bookingId: string; body: SaveRegistrationEmployerRequest }
    >({
      query: ({ bookingId, body }) => ({
        url: `/bookings/${bookingId}/registration/employer`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),
    saveRegistrationTraining: builder.mutation<
      ApiResponse<AdminBookingDetailResponse>,
      { bookingId: string; body: SaveRegistrationTrainingRequest }
    >({
      query: ({ bookingId, body }) => ({
        url: `/bookings/${bookingId}/registration/training`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),
    saveRegistrationPrivacy: builder.mutation<
      ApiResponse<AdminBookingDetailResponse>,
      { bookingId: string; body: SaveRegistrationPrivacyRequest }
    >({
      query: ({ bookingId, body }) => ({
        url: `/bookings/${bookingId}/registration/privacy`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),
    getMockRegistrationData: builder.query<
      ApiResponse<MockRegistrationDataResponse>,
      string
    >({
      query: (courseId) => ({
        url: `/bookings/mock-registration-data`,
        method: "GET",
        params: { courseId },
      }),
    }),
    getAm2ChecklistFlow: builder.query<
      ApiResponse<Am2ChecklistFlowResponse>,
      string
    >({
      query: (courseId) => ({
        url: `/bookings/am2-checklist-flow`,
        method: "GET",
        params: { courseId },
      }),
    }),
    getAm2eChecklistFlow: builder.query<
      ApiResponse<Am2eChecklistFlowResponse>,
      string
    >({
      query: (courseId) => ({
        url: `/bookings/am2e-checklist-flow`,
        method: "GET",
        params: { courseId },
      }),
    }),
    getAm2eV1ChecklistFlow: builder.query<
      ApiResponse<Am2eV1ChecklistFlowResponse>,
      string
    >({
      query: (courseId) => ({
        url: `/bookings/am2e-v1-checklist-flow`,
        method: "GET",
        params: { courseId },
      }),
    }),
    getBookingDocumentsFlow: builder.query<
      ApiResponse<BookingDocumentsFlowResponse>,
      string
    >({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/flow/documents`,
        method: "GET",
      }),
      providesTags: (_result, _error, bookingId) => [
        { type: "Bookings", id: bookingId },
      ],
    }),
  }),
});

export const {
  useGetUserDashboardQuery,
  useGetAdminCandidatesQuery,
  useGetAdminBookingsQuery,
  useGetAdminBookingByIdQuery,
  useGetAdminCandidateByIdQuery,
  useGetAdminSubmissionsQuery,
  useGetAdminCoursesQuery,
  useGetAdminCourseByIdQuery,
  useLazyGetAdminCourseByIdQuery,
  useGetCourseSourceOptionsQuery,
  useCreateAdminCourseMutation,
  useUpdateAdminBookingMutation,
  useUpdateAdminCourseMutation,
  useSendCandidateReminderMutation,
  useSendStuckCandidateRemindersMutation,
  useSaveRegistrationEligibilityMutation,
  useSaveRegistrationAssessmentMutation,
  useSaveRegistrationEmployerMutation,
  useSaveRegistrationTrainingMutation,
  useSaveRegistrationPrivacyMutation,
  useGetMockRegistrationDataQuery,
  useGetAm2ChecklistFlowQuery,
  useGetAm2eChecklistFlowQuery,
  useGetAm2eV1ChecklistFlowQuery,
  useGetBookingDocumentsFlowQuery,
} = dashboardApi;
