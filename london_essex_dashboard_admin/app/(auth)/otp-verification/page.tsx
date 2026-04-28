"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell, OtpInputGroup } from "@/components/auth/auth-shell";
import {
  readPasswordResetContext,
  storePasswordResetContext,
} from "@/features/auth/password-reset-storage";

export default function OtpVerificationPage() {
  const router = useRouter();
  const [recoveryContext] = useState(() => readPasswordResetContext());
  const [otp, setOtp] = useState(() => recoveryContext.token);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const normalizedOtp = otp.trim();

    if (normalizedOtp.length < 6) {
      setFormError("Please enter the 6-digit code from your email.");
      return;
    }

    storePasswordResetContext({
      token: normalizedOtp,
    });

    router.push("/reset-password");
  };

  return (
    <AuthShell
      badge="Verify your identity"
      title="OTP verification"
      description="Enter the 6-digit code sent to your email to confirm it is really you before we reset your password."
      primaryActionLabel="Verify Code"
      onSubmit={handleSubmit}
      formError={formError}
      alternatePrompt="Didn't receive anything?"
      alternateHref="/forgot-password"
      alternateLabel="Resend code"
      showGoogle={false}
      auxiliary={
        <div className="flex items-center justify-between gap-4">
          <span>
            The code was sent to{" "}
            {recoveryContext.email || "your email address"}.
          </span>
          <Link
            href="/forgot-password"
            className="font-semibold text-[#5478bd] transition hover:text-[#1a9dd8]"
          >
            Change email
          </Link>
        </div>
      }
    >
      <OtpInputGroup
        helper="This code expires shortly for your security. Enter each digit to continue."
        value={otp}
        onChange={setOtp}
      />
    </AuthShell>
  );
}
