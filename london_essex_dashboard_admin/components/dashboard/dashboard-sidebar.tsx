"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { dashboardNavItems } from "@/config/dashboard-nav";
import { clearAuthSession } from "@/features/auth/auth-storage";
import { clearAuthState } from "@/features/auth/auth.slice";
import { clearPasswordResetContext } from "@/features/auth/password-reset-storage";
import { useAuthenticatedUser } from "@/features/auth/use-authenticated-user";
import { useProfilePhoto } from "@/hooks/use-profile-photo";
import { useAppDispatch } from "@/lib/redux";

type DashboardSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function DashboardSidebar({
  open,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { photoSrc } = useProfilePhoto();
  const { user } = useAuthenticatedUser();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const displayName = user?.name ?? "Admin User";
  const displayEmail = user?.email ?? "admin@example.com";

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    clearPasswordResetContext();
    clearAuthSession();
    dispatch(clearAuthState());
    setIsLogoutModalOpen(false);
    onClose();
    router.push("/login");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-[#12214d]/25 backdrop-blur-sm transition lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-[250px] border-r border-[#dce8f7] bg-[#fdfefe] transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#edf3fb] px-4 py-5">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="London Essex Electrical Training"
                width={168}
                height={34}
                priority
                className="h-auto w-[228px]"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#d7e6f8] p-2 text-[#33469c] lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-4 py-5">
            <div className="flex items-center gap-3 rounded-xl bg-[#eef5fd] px-4 py-3 text-[#7b8db1]">
              <Search className="h-4 w-4" />
              <input
                type="search"
                placeholder="Search..."
                aria-label="Search navigation"
                className="w-full bg-transparent text-sm text-[#2b3d95] placeholder:text-[#7b8db1] outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            {["Menu", "Help"].map((group) => (
              <div
                key={group}
                className="border-t border-[#edf3fb] py-5 first:border-t-0 first:pt-0"
              >
                <p className="mb-3 px-2 text-xs font-medium text-[#9da8b8]">
                  {group}
                </p>
                <div className="space-y-2">
                  {dashboardNavItems
                    .filter((item) => item.group === group)
                    .map((item) => {
                      const active = pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition [&_svg]:shrink-0 [&>span]:text-inherit ${
                            active
                              ? "bg-[#1ea6df] text-white shadow-[0_10px_24px_rgba(30,166,223,0.22)] [&_svg]:text-white [&>span]:text-white"
                              : "text-[#2b3d95] hover:bg-[#f2f7fd]"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#edf3fb] px-4 py-5">
            <p className="mb-3 text-xs font-medium text-[#9da8b8]">Profile</p>
            <div className="flex items-center gap-3">
              <Image
                src={photoSrc}
                alt={displayName}
                width={42}
                height={42}
                unoptimized
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <p className="text-[15px] font-medium text-[#2f3fa0]">
                  {displayName}
                </p>
                <p className="text-xs text-[#93a2ba]">{displayEmail}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={openLogoutModal}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-[#9ddafd] bg-[#eef8ff] px-4 py-3 text-lg font-medium text-[#2f3fa0] shadow-[0_10px_22px_rgba(37,167,230,0.12)]"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {isLogoutModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2434]/55 p-4">
          <div className="w-full max-w-[420px] rounded-[18px] border border-[#d8e4f6] bg-[#fbfdff] p-5 shadow-[0_24px_60px_rgba(18,33,77,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[20px] font-semibold text-[#33469c]">
                  Log out?
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#7083a6]">
                  You are about to sign out of the admin portal. You will need
                  to log in again to continue managing the dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={closeLogoutModal}
                className="grid h-8 w-8 place-items-center rounded-full text-[#6676b5] transition hover:bg-[#f4f8ff]"
                aria-label="Close logout confirmation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeLogoutModal}
                className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#e0e9f6] bg-white px-5 text-[14px] font-semibold text-[#2f3440]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,#48cfff_0%,#0ba8dd_100%)] px-5 text-[14px] font-semibold text-white"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
