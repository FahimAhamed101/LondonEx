"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AuthInput, AuthShell } from "@/components/auth/auth-shell";
import {
  useResendForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/features/auth/auth.api";
import {
  clearPasswordResetContext,
  clearPasswordResetToken,
  readPasswordResetContext,
  storePasswordResetContext,
} from "@/features/auth/password-reset-storage";

type ResetPasswordFormState = {
  password: string;
  confirmPassword: string;
};

function getApiErrorMessage(error: unknown) {
  const fallbackMessage =
    "We could not update your password right now. Please try again.";

  if (!error || typeof error !== "object") {
    return fallbackMessage;
  }

  const apiError = error as FetchBaseQueryError & {
    data?: { message?: string };
  };

  if (typeof apiError.data?.message === "string") {
    return apiError.data.message;
  }

  if ("error" in apiError && typeof apiError.error === "string") {
    return apiError.error;
  }

  return fallbackMessage;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [resendForgotPassword, { isLoading: isResending }] =
    useResendForgotPasswordMutation();
  const [recoveryContext] = useState(() => readPasswordResetContext());
  const [form, setForm] = useState<ResetPasswordFormState>({
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setResendMessage(null);

    if (!recoveryContext.token.trim()) {
      setFormError("Your reset code is missing. Please verify your OTP again.");
      return;
    }

    if (!form.password.trim()) {
      setFormError("Please enter your new password.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFormError("Your passwords do not match.");
      return;
    }

    try {
      await resetPassword({
        token: recoveryContext.token.trim(),
        password: form.password,
      }).unwrap();

      clearPasswordResetContext();
      router.push("/login");
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  const handleResendCode = async () => {
    setFormError(null);
    setResendMessage(null);

    if (!recoveryContext.email.trim()) {
      setFormError(
        "Your recovery email is missing. Please start again from forgot password.",
      );
      return;
    }

    try {
      const response = await resendForgotPassword({
        email: recoveryContext.email.trim(),
      }).unwrap();

      clearPasswordResetToken();
      storePasswordResetContext({
        email: response.data.email ?? recoveryContext.email.trim(),
        token: response.data.token,
      });

      setResendMessage("A fresh reset code has been sent to your email.");
      router.push("/otp-verification");
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  return (
    <AuthShell
      badge="Set your new password"
      title="Reset password"
      description="Choose a strong password for your learner portal so you can get back to your training dashboard securely."
      primaryActionLabel={isLoading ? "Updating..." : "Update Password"}
      onSubmit={handleSubmit}
      primaryActionDisabled={isLoading}
      formError={formError}
      alternatePrompt="Need a fresh code?"
      alternateHref="/otp-verification"
      alternateLabel="Return to verification"
      showGoogle={false}
      auxiliary={
        <div className="space-y-3 rounded-2xl border border-[#d8ebf7] bg-[#f6fbff] px-4 py-4 text-sm leading-6 text-[#7083a6]">
          <p>
            Password tip: use at least 8 characters with a mix of letters,
            numbers, and a symbol for stronger account protection.
            {recoveryContext.email
              ? ` Resetting access for ${recoveryContext.email}.`
              : ""}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Need a fresh reset code instead?</span>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="font-semibold text-[#5478bd] transition hover:text-[#1a9dd8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending ? "Resending..." : "Resend code"}
            </button>
          </div>
          {resendMessage ? (
            <p className="rounded-2xl border border-[#cdebd6] bg-[#f1fbf4] px-4 py-3 text-sm text-[#1f7a3d]">
              {resendMessage}
            </p>
          ) : null}
        </div>
      }
    >
      <AuthInput
        label="New password"
        placeholder="Enter a new password"
        type="password"
        icon="lock"
        name="password"
        value={form.password}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />
      <AuthInput
        label="Confirm password"
        placeholder="Re-enter your new password"
        type="password"
        icon="lock"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />
      <p className="text-sm text-[#90a0b8]">
        Want to start over?{" "}
        <Link href="/forgot-password" className="font-semibold text-[#5478bd]">
          Request another OTP
        </Link>
        .
      </p>
    </AuthShell>
  );
}
