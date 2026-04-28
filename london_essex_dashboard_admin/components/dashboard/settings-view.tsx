"use client";

import Image from "next/image";
import { useRef } from "react";
import { useEffect, useState, useTransition } from "react";
import {
  Bell,
  Camera,
  CalendarRange,
  Cog,
  GraduationCap,
  Mail,
  Shield,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthenticatedUser } from "@/features/auth/use-authenticated-user";
import { useProfilePhoto } from "@/hooks/use-profile-photo";

type SettingsTab =
  | "general"
  | "notifications"
  | "security"
  | "course-defaults"
  | "email-templates";

type NotificationKey =
  | "candidateRegistration"
  | "checklistSubmission"
  | "bookingConfirmation"
  | "paymentReceived"
  | "supportTicket"
  | "stuckCandidate";

const tabItems: Array<{
  id: SettingsTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "general", label: "General", icon: Cog },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "course-defaults", label: "Course Defaults", icon: GraduationCap },
  { id: "email-templates", label: "Email Templates", icon: CalendarRange },
];

const tabContentMeta: Record<
  SettingsTab,
  { title: string; subtitle: string; saveLabel: string }
> = {
  general: {
    title: "General Settings",
    subtitle: "Basic platform configuration.",
    saveLabel: "Save Changes",
  },
  notifications: {
    title: "Notification Preferences",
    subtitle: "Notification Preferences",
    saveLabel: "Save Changes",
  },
  security: {
    title: "Security Settings",
    subtitle: "Manage your password and security preferences.",
    saveLabel: "Save Changes",
  },
  "course-defaults": {
    title: "Course Default Settings",
    subtitle: "Configure default values for new courses.",
    saveLabel: "Save Changes",
  },
  "email-templates": {
    title: "Notification Preferences",
    subtitle: "Notification Preferences",
    saveLabel: "Save Changes",
  },
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onChange}
      className={`relative inline-flex h-8 w-[42px] shrink-0 items-center rounded-full transition ${
        checked ? "bg-[#1ea6df]" : "bg-[#a7a9af]"
      }`}
    >
      <span
        className={`inline-block h-7 w-7 rounded-full bg-white shadow-[0_2px_6px_rgba(17,24,39,0.18)] transition ${
          checked ? "translate-x-[13px]" : "translate-x-[1px]"
        }`}
      />
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  helper?: string;
}) {
  return (
    <div>
      <label className="text-[12px] font-medium text-[#5c6893]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-[10px] border border-[#e2ebf8] bg-[#fbfdff] px-4 text-[13px] text-[#4051a6] outline-none placeholder:text-[#b0b8cb] focus:border-[#8fd1ef]"
      />
      {helper ? (
        <p className="mt-2 text-[11px] text-[#7f89ab]">{helper}</p>
      ) : null}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[12px] font-medium text-[#5c6893]">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-[220px] w-full resize-y rounded-[10px] border border-[#e2ebf8] bg-[#fbfdff] px-4 py-3 text-[13px] leading-6 text-[#4051a6] outline-none placeholder:text-[#b0b8cb] focus:border-[#8fd1ef]"
      />
    </div>
  );
}

export function SettingsView({
  initialTab = "general",
}: {
  initialTab?: SettingsTab;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    photoSrc,
    hasCustomPhoto,
    setProfilePhoto,
    clearProfilePhoto,
  } = useProfilePhoto();
  const { user } = useAuthenticatedUser();

  const [generalForm, setGeneralForm] = useState<{
    name?: string;
    email?: string;
  }>({});
  const [notificationSettings, setNotificationSettings] = useState<
    Record<NotificationKey, boolean>
  >({
    candidateRegistration: true,
    checklistSubmission: true,
    bookingConfirmation: true,
    paymentReceived: true,
    supportTicket: true,
    stuckCandidate: false,
  });
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [courseDefaultsForm, setCourseDefaultsForm] = useState({
    seatCapacity: "",
    bookingCutoff: "",
    autoApprove: true,
  });
  const [emailTemplatesForm, setEmailTemplatesForm] = useState({
    welcomeSubject: "Welcome to London & Essex Electrical Training",
    welcomeBody:
      "Dear {name},\n\nWelcome to our platform! Your account has been created successfully.\nPlease log in to start your registration process.\n\nBest regards,\nAdmin Team",
    reminderSubject: "e.g. AM2 Assessment Preparation",
    reminderBody:
      "Dear {name},\n\nThis is a friendly reminder to complete your registration for {course}. Your current progress is {progress}%.\nPlease log in to continue.\n\nBest regards,\nAdmin Team",
  });
  const [saveMessage, setSaveMessage] = useState("");

  const meta = tabContentMeta[activeTab] ?? tabContentMeta.general;
  const resolvedGeneralForm = {
    name: generalForm.name ?? user?.name ?? "Jenny Wilson",
    email: generalForm.email ?? user?.email ?? "jenny.wilson@example.com",
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const changeTab = (tab: SettingsTab) => {
    setActiveTab(tab);
    startTransition(() => {
      router.replace(`${pathname}?tab=${tab}`, { scroll: false });
    });
  };

  const handleSave = () => {
    setSaveMessage(`${meta.title} updated successfully.`);
    window.setTimeout(() => setSaveMessage(""), 2200);
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSaveMessage("Please choose an image file.");
      event.target.value = "";
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Unable to read image file."));
      reader.readAsDataURL(file);
    });

    setProfilePhoto(dataUrl);
    setSaveMessage("Profile photo updated successfully.");
    event.target.value = "";
  };

  const handleDeletePhoto = () => {
    clearProfilePhoto();
    setSaveMessage("Profile photo removed.");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[210px_minmax(0,1fr)]">
      <aside className="rounded-[18px] border border-[#dbe7f8] bg-[#fbfdff] px-4 py-5 shadow-[0_12px_32px_rgba(22,43,120,0.04)]">
        <p className="text-[12px] font-medium text-[#7e89aa]">Setting</p>
        <div className="mt-4 space-y-2">
          {tabItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => changeTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[15px] transition ${
                  isActive
                    ? "bg-[#1ea6df] text-white shadow-[0_12px_24px_rgba(30,166,223,0.18)]"
                    : "text-[#4c5c92] hover:bg-[#f4f9ff]"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="rounded-[18px] border border-[#dbe7f8] bg-[#fbfdff] p-4 shadow-[0_12px_32px_rgba(22,43,120,0.04)] sm:p-5">
        <nav className="mb-4 flex items-center gap-3 text-[13px] text-[#c2c9d8]">
          <span>Dashboard</span>
          <span>/</span>
          <span>Setting</span>
          <span>/</span>
          <span className="font-medium text-[#4451ac]">
            {tabItems.find((item) => item.id === activeTab)?.label ?? "General"}
          </span>
        </nav>

        <div className="flex flex-col gap-4 border-b border-[#e9eef8] pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[24px] font-medium text-[#31439f]">{meta.title}</h1>
            <p className="mt-2 text-[14px] text-[#66749b]">{meta.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center self-start rounded-[10px] bg-[linear-gradient(90deg,#59d1ff_0%,#14ace6_100%)] px-6 text-[15px] font-semibold text-white shadow-[0_12px_24px_rgba(20,172,230,0.22)] disabled:opacity-70"
          >
            {meta.saveLabel}
          </button>
        </div>

        {saveMessage ? (
          <div className="mt-4 rounded-[12px] border border-[#d8ebfb] bg-[#f1f9ff] px-4 py-3 text-[13px] font-medium text-[#3b4ea2]">
            {saveMessage}
          </div>
        ) : null}

        <div className="mt-4 rounded-[16px] border border-[#e4ebf8] bg-[#fcfdff] p-4">
          {activeTab === "general" ? (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelected}
                className="hidden"
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative w-fit">
                  <button
                    type="button"
                    onClick={handleChangePhotoClick}
                    className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-[#1ea6df] text-white shadow-[0_10px_18px_rgba(30,166,223,0.2)]"
                  >
                    <Image
                      src={photoSrc}
                      alt={`${resolvedGeneralForm.name} profile photo`}
                      width={56}
                      height={56}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </button>
                  <div className="pointer-events-none absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-[#1ea6df] text-white">
                    <Camera className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleChangePhotoClick}
                    className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[#d9e5f6] bg-white px-5 text-[14px] font-semibold text-[#3c4da5]"
                  >
                    Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    disabled={!hasCustomPhoto}
                    className={`text-[14px] font-medium ${
                      hasCustomPhoto
                        ? "text-[#ff4c45]"
                        : "cursor-not-allowed text-[#ffb3b0]"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <Field
                label="Your Name"
                value={resolvedGeneralForm.name}
                onChange={(value) =>
                  setGeneralForm((current) => ({ ...current, name: value }))
                }
              />
              <Field
                label="Admin Email"
                value={resolvedGeneralForm.email}
                onChange={(value) =>
                  setGeneralForm((current) => ({ ...current, email: value }))
                }
              />
            </div>
          ) : null}

          {activeTab === "notifications" ? (
            <div className="space-y-2">
              {[
                {
                  key: "candidateRegistration" as const,
                  title: "New Candidate Registration.",
                  description:
                    "Get notified when a new candidate creates an account.",
                },
                {
                  key: "checklistSubmission" as const,
                  title: "Checklist Submission.",
                  description:
                    "Get notified when a candidate submits their readiness checklist.",
                },
                {
                  key: "bookingConfirmation" as const,
                  title: "Booking Confirmation.",
                  description:
                    "Get notified when a new course booking is made.",
                },
                {
                  key: "paymentReceived" as const,
                  title: "Payment Received.",
                  description:
                    "Get notified when a payment is processed.",
                },
                {
                  key: "supportTicket" as const,
                  title: "New Support Ticket.",
                  description:
                    "Get notified when a candidate submits a support request.",
                },
                {
                  key: "stuckCandidate" as const,
                  title: "Stuck Candidate Alert.",
                  description:
                    "Get a daily digest of candidates inactive for 7+ days.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 border-b border-dashed border-[#e8eef8] py-5 last:border-b-0 last:pb-0 first:pt-0"
                >
                  <div>
                    <h2 className="text-[18px] font-medium text-[#31439f]">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-[13px] text-[#7482a7]">
                      {item.description}
                    </p>
                  </div>
                  <Toggle
                    checked={notificationSettings[item.key]}
                    onChange={() =>
                      setNotificationSettings((current) => ({
                        ...current,
                        [item.key]: !current[item.key],
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "security" ? (
            <div className="space-y-4">
              <h2 className="text-[18px] font-medium text-[#31439f]">
                Change Password
              </h2>
              <Field
                label="Current Password"
                type="password"
                value={securityForm.currentPassword}
                onChange={(value) =>
                  setSecurityForm((current) => ({
                    ...current,
                    currentPassword: value,
                  }))
                }
                placeholder="Current Password"
              />
              <Field
                label="New Password"
                type="password"
                value={securityForm.newPassword}
                onChange={(value) =>
                  setSecurityForm((current) => ({
                    ...current,
                    newPassword: value,
                  }))
                }
                placeholder="New Password"
              />
              <Field
                label="Confirm New Password"
                type="password"
                value={securityForm.confirmPassword}
                onChange={(value) =>
                  setSecurityForm((current) => ({
                    ...current,
                    confirmPassword: value,
                  }))
                }
                placeholder="Confirm New Password"
              />
            </div>
          ) : null}

          {activeTab === "course-defaults" ? (
            <div className="space-y-4">
              <Field
                label="Default Seat Capacity"
                value={courseDefaultsForm.seatCapacity}
                onChange={(value) =>
                  setCourseDefaultsForm((current) => ({
                    ...current,
                    seatCapacity: value,
                  }))
                }
                placeholder="e.g. 20"
                helper="Default number of seats when creating a new course"
              />
              <Field
                label="Booking Cutoff (days before course)"
                value={courseDefaultsForm.bookingCutoff}
                onChange={(value) =>
                  setCourseDefaultsForm((current) => ({
                    ...current,
                    bookingCutoff: value,
                  }))
                }
                placeholder="e.g. 3 Day"
                helper="How many days before the course date bookings close"
              />

              <div className="flex items-center justify-between gap-4 border-t border-dashed border-[#e8eef8] pt-5">
                <div>
                  <h2 className="text-[18px] font-medium text-[#31439f]">
                    Auto-Approve Bookings
                  </h2>
                  <p className="mt-2 text-[13px] text-[#7482a7]">
                    Automatically confirm bookings after payment without manual
                    review
                  </p>
                </div>
                <Toggle
                  checked={courseDefaultsForm.autoApprove}
                  onChange={() =>
                    setCourseDefaultsForm((current) => ({
                      ...current,
                      autoApprove: !current.autoApprove,
                    }))
                  }
                />
              </div>
            </div>
          ) : null}

          {activeTab === "email-templates" ? (
            <div className="space-y-4">
              <div className="rounded-[14px] border border-[#edf1f9] bg-[#fcfdff] p-3">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#4d5eb2]" />
                    <h2 className="text-[18px] font-medium text-[#31439f]">
                      Welcome Email
                    </h2>
                  </div>
                  <Field
                    label="Subject"
                    value={emailTemplatesForm.welcomeSubject}
                    onChange={(value) =>
                      setEmailTemplatesForm((current) => ({
                        ...current,
                        welcomeSubject: value,
                      }))
                    }
                  />
                  <TextAreaField
                    label="Body"
                    value={emailTemplatesForm.welcomeBody}
                    onChange={(value) =>
                      setEmailTemplatesForm((current) => ({
                        ...current,
                        welcomeBody: value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="rounded-[14px] border border-[#edf1f9] bg-[#fcfdff] p-3">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#4d5eb2]" />
                    <h2 className="text-[18px] font-medium text-[#31439f]">
                      Reminder Email
                    </h2>
                  </div>
                  <Field
                    label="Subject"
                    value={emailTemplatesForm.reminderSubject}
                    onChange={(value) =>
                      setEmailTemplatesForm((current) => ({
                        ...current,
                        reminderSubject: value,
                      }))
                    }
                  />
                  <TextAreaField
                    label="Body"
                    value={emailTemplatesForm.reminderBody}
                    onChange={(value) =>
                      setEmailTemplatesForm((current) => ({
                        ...current,
                        reminderBody: value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
