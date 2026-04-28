import { baseApi } from "@/lib/api/base-api";
import type {
  ApiResponse,
  AuthenticatedUserResponse,
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  ResetPasswordRequest,
  SignupRequest,
} from "@/features/auth/auth.types";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),
    signup: builder.mutation<ApiResponse<AuthResponse>, SignupRequest>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),
    forgotPassword: builder.mutation<
      ApiResponse<ForgotPasswordResponse>,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resendForgotPassword: builder.mutation<
      ApiResponse<ForgotPasswordResponse>,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/forgot-password/resend",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      ApiResponse<{ success: boolean }>,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<ApiResponse<AuthenticatedUserResponse>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useGetProfileQuery,
  useLoginMutation,
  useResendForgotPasswordMutation,
  useResetPasswordMutation,
  useSignupMutation,
} = authApi;
