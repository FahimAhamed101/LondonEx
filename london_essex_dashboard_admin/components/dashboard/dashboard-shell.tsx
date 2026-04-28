"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { loadAuthSession } from "@/features/auth/auth-storage";
import { setCredentials } from "@/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux";

export function DashboardShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
  const [isHydratingAuth, setIsHydratingAuth] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const session = loadAuthSession();
    const hydrationTimer = window.setTimeout(() => {
      setIsHydratingAuth(false);
    }, 0);

    if (session.accessToken) {
      dispatch(
        setCredentials({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          user: session.user,
        }),
      );
    }

    return () => {
      window.clearTimeout(hydrationTimer);
    };
  }, [dispatch]);

  useEffect(() => {
    if (isHydratingAuth) {
      return;
    }

    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, isHydratingAuth, router]);

  if (isHydratingAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f7fc] px-4 text-center text-sm text-[#6f778b]">
        Loading dashboard...
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f7fc] text-[#2b3a67]">
      <div className="mx-auto flex ">
        <DashboardSidebar open={open} onClose={() => setOpen(false)} />

        <div className="min-w-0 flex-1 lg:pl-[250px]">
          <DashboardTopbar onMenuClick={() => setOpen(true)} />

          <main className="px-4 pb-6 pt-4 sm:px-6 lg:px-6">
            <div className="mb-4 flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-sm font-medium text-[#2d3d8f] shadow-sm"
              >
                <Menu className="h-4 w-4" />
                Menu
              </button>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
