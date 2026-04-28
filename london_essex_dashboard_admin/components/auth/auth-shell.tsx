"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

const primaryActionClassName =
  "mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-[linear-gradient(90deg,#203a84_0%,#24baef_100%)] text-base font-semibold !text-white visited:!text-white shadow-[0_22px_35px_rgba(45,113,187,0.22)] transition hover:translate-y-[-1px] hover:!text-white hover:shadow-[0_26px_40px_rgba(45,113,187,0.28)]";

type AuthFeature = {
  title: string;
  description: string;
};

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  primaryActionHref?: string;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  primaryActionDisabled?: boolean;
  formError?: string | null;
  alternatePrompt: string;
  alternateHref: string;
  alternateLabel: string;
  auxiliary?: React.ReactNode;
  children: React.ReactNode;
  showGoogle?: boolean;
};

type AuthInputProps = {
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password";
  icon?: "mail" | "lock" | "user";
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
};

type OtpInputGroupProps = {
  helper: string;
  value?: string;
  onChange?: (value: string) => void;
};

const featureCards: AuthFeature[] = [
  {
    title: "Flexible practical and theory-led training programmes",
    description: "Study across London and Essex with a learner-first schedule.",
  },
  {
    title: "Fast access to bookings, AM2 prep, and learner progress",
    description: "Keep every milestone in one organised training hub.",
  },
  {
    title: "Secure sign-in flow for your training dashboard",
    description: "Move from login to assessment booking without friction.",
  },
];

const infoHighlights = [
  "Trusted by learners across London and Essex",
  "Candidate experience",
];

function GoogleMark() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.09 5.09 0 0 1-2.21 3.34v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.12Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.85 0-5.27-1.92-6.14-4.5H2.18v2.84A11 11 0 0 0 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.86 14.13A6.56 6.56 0 0 1 5.5 12c0-.74.13-1.45.36-2.13V7.03H2.18A11.02 11.02 0 0 0 1 12c0 1.77.42 3.44 1.18 4.97l3.68-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.37c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.03l3.68 2.84C6.73 7.29 9.15 5.37 12 5.37Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function renderInputIcon(icon?: AuthInputProps["icon"]) {
  if (icon === "mail") {
    return <Mail className="h-4.5 w-4.5" />;
  }

  if (icon === "lock") {
    return <Lock className="h-4.5 w-4.5" />;
  }

  return <User className="h-4.5 w-4.5" />;
}

export function AuthInput({
  label,
  placeholder,
  type = "text",
  icon = "user",
  name,
  value,
  onChange,
  autoComplete,
  required = false,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const effectiveType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <label className="block space-y-2.5">
      <span className="text-sm font-semibold text-[#4d5f90]">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#94a5c5]">
          {renderInputIcon(icon)}
        </span>
        <input
          name={name}
          type={effectiveType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          className="h-14 w-full rounded-2xl border border-[#d9e6f6] bg-[#fdfefe] pl-12 pr-12 text-[15px] text-[#203263] outline-none transition focus:border-[#3db5eb] focus:ring-4 focus:ring-[#b7e8fb]"
        />
        {type === "password" ? (
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-4 flex items-center text-[#90a2c2] transition hover:text-[#4463a8]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4.5 w-4.5" />
            ) : (
              <Eye className="h-4.5 w-4.5" />
            )}
          </button>
        ) : null}
      </span>
    </label>
  );
}

export function OtpInputGroup({
  helper,
  value,
  onChange,
}: OtpInputGroupProps) {
  const [internalDigits, setInternalDigits] = useState(() =>
    Array.from({ length: 6 }, () => ""),
  );
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits =
    value !== undefined
      ? Array.from({ length: 6 }, (_, index) => value[index] ?? "")
      : internalDigits;

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const updateDigits = (updater: (current: string[]) => string[]) => {
    const next = updater(digits);

    if (value === undefined) {
      setInternalDigits(next);
    }

    onChange?.(next.join(""));
  };

  const handleDigitChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) {
      updateDigits((current) => {
        const next = [...current];
        next[index] = "";
        return next;
      });
      return;
    }

    updateDigits((current) => {
      const next = [...current];
      const chars = numericValue.slice(0, 6 - index).split("");

      chars.forEach((char, offset) => {
        next[index + offset] = char;
      });

      return next;
    });

    const nextIndex = Math.min(index + numericValue.length, digits.length - 1);
    focusInput(nextIndex);
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      if (digits[index]) {
        updateDigits((current) => {
          const next = [...current];
          next[index] = "";
          return next;
        });
        return;
      }

      if (index > 0) {
        updateDigits((current) => {
          const next = [...current];
          next[index - 1] = "";
          return next;
        });
        focusInput(index - 1);
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < digits.length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");

    if (!pasted) {
      return;
    }

    updateDigits((current) => {
      const next = [...current];
      pasted
        .slice(0, digits.length - index)
        .split("")
        .forEach((char, offset) => {
          next[index + offset] = char;
        });
      return next;
    });

    const nextIndex = Math.min(index + pasted.length, digits.length - 1);
    focusInput(nextIndex);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#4d5f90]">Verification code</p>
        <span className="rounded-full bg-[#eef8ff] px-3 py-1 text-[12px] font-semibold text-[#279bd7]">
          00:45
        </span>
      </div>
      <div className="grid grid-cols-6 gap-2.5">
        {digits.map((digit, box) => (
          <input
            key={box}
            ref={(element) => {
              inputRefs.current[box] = element;
            }}
            value={digit}
            inputMode="numeric"
            maxLength={1}
            aria-label={`OTP digit ${box + 1}`}
            onChange={(event) => handleDigitChange(box, event.target.value)}
            onKeyDown={(event) => handleKeyDown(box, event)}
            onPaste={(event) => handlePaste(box, event)}
            className="h-14 rounded-2xl border border-[#d9e6f6] bg-white text-center text-lg font-bold text-[#24356a] outline-none transition focus:border-[#33afe9] focus:ring-4 focus:ring-[#c5efff]"
          />
        ))}
      </div>
      <p className="text-sm text-[#8c9dbd]">{helper}</p>
    </div>
  );
}

export function AuthShell({
  badge,
  title,
  description,
  primaryActionLabel,
  primaryActionHref,
  onSubmit,
  primaryActionDisabled = false,
  formError,
  alternatePrompt,
  alternateHref,
  alternateLabel,
  auxiliary,
  children,
  showGoogle = true,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(120deg,#edf8ff_0%,#f7fbfe_35%,#ffffff_100%)]">
      <div className="grid min-h-screen lg:grid-cols-[1.12fr_0.88fr]">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(87,221,255,0.32),transparent_28%),linear-gradient(145deg,#274987_0%,#1b84cb_52%,#5dd2ff_100%)] px-6 py-8 text-white sm:px-8 lg:px-10 lg:py-9">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]" />
          <div className="relative flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/14 px-4 py-3 shadow-[0_18px_30px_rgba(20,63,114,0.2)] backdrop-blur-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#2a57a3]">
                  <Sparkles className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-tight">
                    London &amp; Essex Electrical Training
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
                Admin Portal
              </div>
            </div>

            <div className="mt-14 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4" />
              {infoHighlights[0]}
            </div>

            <div className="mt-10 max-w-2xl">
              <h1 className="max-w-xl text-4xl font-medium leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-[4rem]">
                Welcome back to London &amp; Essex Electrical Training
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-white/78 sm:text-lg">
                Log in to manage your courses, discover new opportunities, and
                track your training in real-time.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {featureCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[28px] border border-white/14 bg-white/10 p-5 shadow-[0_18px_40px_rgba(15,61,112,0.12)] backdrop-blur-sm"
                >
                  <ShieldCheck className="h-5 w-5 text-white/85" />
                  <h2 className="mt-8 text-lg font-medium leading-7 text-white/90">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/68">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <div className="rounded-[34px] border border-white/14 bg-white/10 px-6 py-6 shadow-[0_20px_45px_rgba(15,61,112,0.15)] backdrop-blur-sm sm:px-8 sm:py-7">
                <p className="text-xs font-semibold uppercase tracking-[0.36em] text-white/50">
                  {infoHighlights[1]}
                </p>
                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <p className="max-w-md text-2xl font-medium leading-9 tracking-[-0.03em] text-white">
                    Smooth access from sign in to assessment booking
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm">
                    Continue securely
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-[28rem] rounded-[2rem] border border-white bg-white/92 p-7 shadow-[0_30px_80px_rgba(37,85,137,0.14)] backdrop-blur sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eef8ff] px-4 py-2 text-sm font-semibold text-[#2e9fd8]">
              <Sparkles className="h-4 w-4" />
              {badge}
            </div>

            <h2 className="mt-6 text-4xl font-medium tracking-[-0.04em] text-[#25356a]">
              {title}
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#8493ae]">
              {description}
            </p>

            {showGoogle ? (
              <>
                <button
                  type="button"
                  className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#2d77b8] bg-[linear-gradient(90deg,#274987_0%,#23b6ec_100%)] text-sm font-semibold text-white transition hover:brightness-105"
                >
                  <GoogleMark />
                  Continue with Google
                </button>

                <div className="my-8 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#b0bdd0]">
                  <span className="h-px flex-1 bg-[#e4edf7]" />
                  Or
                  <span className="h-px flex-1 bg-[#e4edf7]" />
                </div>
              </>
            ) : (
              <div className="mt-8" />
            )}

            <form className="space-y-5" onSubmit={onSubmit}>
              {children}

              {auxiliary ? (
                <div className="pt-0.5 text-sm text-[#7f8eab]">{auxiliary}</div>
              ) : null}

              {formError ? (
                <p className="rounded-2xl border border-[#ffd7db] bg-[#fff2f4] px-4 py-3 text-sm text-[#c5394f]">
                  {formError}
                </p>
              ) : null}

              {primaryActionHref ? (
                <Link
                  href={primaryActionHref}
                  className={primaryActionClassName}
                >
                  {primaryActionLabel}
                </Link>
              ) : (
                <button
                  type="submit"
                  className={primaryActionClassName}
                  disabled={primaryActionDisabled}
                >
                  {primaryActionLabel}
                </button>
              )}
            </form>

            <p className="mt-6 text-center text-sm text-[#8b9ab4]">
              {alternatePrompt}{" "}
              <Link
                href={alternateHref}
                className="font-semibold text-[#25356a] transition hover:text-[#1b9ed7]"
              >
                {alternateLabel}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
