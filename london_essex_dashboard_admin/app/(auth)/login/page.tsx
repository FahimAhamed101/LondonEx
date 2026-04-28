"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AuthInput, AuthShell } from "@/components/auth/auth-shell";
import { useLoginMutation } from "@/features/auth/auth.api";
import { persistAuthSession } from "@/features/auth/auth-storage";
import { setCredentials } from "@/features/auth/auth.slice";
import { useAppDispatch } from "@/lib/redux";

type LoginFormState = {
  email: string;
  password: string;
};

function getApiErrorMessage(error: unknown) {
  const fallbackMessage = "Unable to sign in right now. Please try again.";

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

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
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

    if (!form.email.trim() || !form.password.trim()) {
      setFormError("Please enter your email and password.");
      return;
    }

    try {
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      }).unwrap();

      persistAuthSession({
        accessToken: response.data.token,
        refreshToken: null,
        user: response.data.user,
      });

      dispatch(
        setCredentials({
          accessToken: response.data.token,
          user: response.data.user,
        }),
      );

      router.push("/dashboard");
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  return (
    <AuthShell
      badge="Sign in to your learner space"
      title="Sign in"
      description="Pick up where you left off, review your upcoming courses, and continue your training journey."
      primaryActionLabel={isLoading ? "Signing In..." : "Sign In"}
      onSubmit={handleSubmit}
      primaryActionDisabled={isLoading}
      formError={formError}
      alternatePrompt="Don't have an account?"
      alternateHref="/signup"
      alternateLabel="Sign up"
      auxiliary={
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm text-[#8190ac]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-[#cddaea] accent-[#2b9fd8]"
            />
            Keep me signed in
          </label>
          <Link
            href="/forgot-password"
            className="font-semibold text-[#5478bd] transition hover:text-[#1a9dd8]"
          >
            Forgot your password
          </Link>
        </div>
      }
    >
      <AuthInput
        label="Your email address"
        placeholder="name@example.com"
        type="email"
        icon="mail"
        name="email"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
        required
      />
      <AuthInput
        label="Your password"
        placeholder="Enter your password"
        type="password"
        icon="lock"
        name="password"
        value={form.password}
        onChange={handleChange}
        autoComplete="current-password"
        required
      />
    </AuthShell>
  );
}
