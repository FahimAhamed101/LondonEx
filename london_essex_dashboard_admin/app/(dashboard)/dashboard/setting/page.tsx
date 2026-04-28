import { SettingsView } from "@/components/dashboard/settings-view";

const allowedTabs = new Set([
  "general",
  "notifications",
  "security",
  "course-defaults",
  "email-templates",
] as const);

type SettingsTab = (typeof allowedTabs extends Set<infer T> ? T : never);

export default async function SettingPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const requestedTab = resolvedSearchParams.tab;
  const tab: SettingsTab =
    requestedTab && allowedTabs.has(requestedTab as SettingsTab)
      ? (requestedTab as SettingsTab)
      : "general";

  return <SettingsView initialTab={tab} />;
}
