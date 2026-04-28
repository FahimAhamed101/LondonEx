"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AuthInput, AuthShell } from "@/components/auth/auth-shell";
import { useForgotPasswordMutation } from "@/features/auth/auth.api";
import { storePasswordResetContext } from "@/features/auth/password-reset-storage";

type ForgotPasswordFormState = {
  email: string;
};

function getApiErrorMessage(error: unknown) {
  const fallbackMessage =
    "We could not start the password reset right now. Please try again.";

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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [form, setForm] = useState<ForgotPasswordFormState>({
    email: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

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

    const email = form.email.trim();

    if (!email) {
      setFormError("Please enter the email linked to your account.");
      return;
    }

    try {
      const response = await forgotPassword({ email }).unwrap();

      storePasswordResetContext({
        email: response.data.email ?? email,
        token: response.data.token,
      });

      router.push("/otp-verification");
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  return (
    <AuthShell
      badge="Recover your account"
      title="Forgot password"
      description="Enter the email linked to your learner portal and we will send a one-time verification code."
      primaryActionLabel={isLoading ? "Sending..." : "Send OTP Code"}
      onSubmit={handleSubmit}
      primaryActionDisabled={isLoading}
      formError={formError}
      alternatePrompt="Remember your password?"
      alternateHref="/login"
      alternateLabel="Back to sign in"
      showGoogle={false}
      auxiliary={
        <p>
          We will send the code to your registered address and keep your current
          sessions protected.
        </p>
      }
    >
      <AuthInput
        label="Registered email"
        placeholder="name@example.com"
        type="email"
        icon="mail"
        name="email"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
        required
      />
      <div className="rounded-2xl border border-[#d8ebf7] bg-[#f6fbff] px-4 py-4 text-sm leading-6 text-[#7083a6]">
        Need help accessing a different inbox?{" "}
        <Link href="/signup" className="font-semibold text-[#2a9ed8]">
          Contact admissions
        </Link>{" "}
        or create a fresh learner account.
      </div>
    </AuthShell>
  );
}
