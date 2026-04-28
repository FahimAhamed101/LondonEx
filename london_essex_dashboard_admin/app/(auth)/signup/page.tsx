"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AuthInput, AuthShell } from "@/components/auth/auth-shell";
import { useSignupMutation } from "@/features/auth/auth.api";
import { persistAuthSession } from "@/features/auth/auth-storage";
import { setCredentials } from "@/features/auth/auth.slice";
import { useAppDispatch } from "@/lib/redux";

type SignupFormState = {
  name: string;
  email: string;
  password: string;
  agreedToTerms: boolean;
};

function getApiErrorMessage(error: unknown) {
  const fallbackMessage = "Unable to create your admin account right now.";

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

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [form, setForm] = useState<SignupFormState>({
    name: "",
    email: "",
    password: "",
    agreedToTerms: false,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const adminSetupSecret =
    process.env.NEXT_PUBLIC_ADMIN_SETUP_SECRET?.trim() ?? "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError("Please complete your name, email, and password.");
      return;
    }

    if (!form.agreedToTerms) {
      setFormError("Please accept the terms before continuing.");
      return;
    }

    if (!adminSetupSecret) {
      setFormError(
        "Missing admin setup secret. Add NEXT_PUBLIC_ADMIN_SETUP_SECRET to your env.",
      );
      return;
    }

    try {
      const response = await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: "admin",
        adminSetupSecret,
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
      badge="Create your learner account"
      title="Sign up"
      description="Set up your learner portal to manage bookings, course access, and your progress in one secure place."
      primaryActionLabel={isLoading ? "Creating Account..." : "Create Account"}
      onSubmit={handleSubmit}
      primaryActionDisabled={isLoading}
      formError={formError}
      alternatePrompt="Already have an account?"
      alternateHref="/login"
      alternateLabel="Sign in"
      auxiliary={
        <label className="flex items-start gap-3 text-sm leading-6 text-[#8190ac]">
          <input
            name="agreedToTerms"
            type="checkbox"
            checked={form.agreedToTerms}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border border-[#cddaea] accent-[#2b9fd8]"
          />
          <span>
            I agree to the{" "}
            <Link href="/login" className="font-semibold text-[#5478bd]">
              terms
            </Link>{" "}
            and confirm my learner details are correct.
          </span>
        </label>
      }
    >
      <AuthInput
        label="Full name"
        placeholder="Your full name"
        type="text"
        icon="user"
        name="name"
        value={form.name}
        onChange={handleChange}
        autoComplete="name"
        required
      />
      <AuthInput
        label="Email address"
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
        label="Create password"
        placeholder="Set a secure password"
        type="password"
        icon="lock"
        name="password"
        value={form.password}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />
    </AuthShell>
  );
}
