"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { HiChevronRight, HiShieldCheck } from "react-icons/hi";
import { signOut } from "next-auth/react";

export default function AdminDashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center gap-1.5 min-w-0">
          <HiChevronRight className="text-gray-300 flex-shrink-0" />
          <div className="flex items-center gap-1.5">
            <HiShieldCheck className="text-primary-500 text-sm flex-shrink-0" />
            <span className="text-sm font-bold text-primary-600 tracking-wide uppercase text-xs">
              Admin
            </span>
          </div>
        </div>

        {/* ── Right: user info ─────────────────────────────────────────────── */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {session?.user?.name}
            </p>
            <p className="text-[10px] text-gray-400 leading-tight">
              {session?.user?.email}
            </p>
          </div>

          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
            <Image
              src={session?.user?.image ?? "/user.png"}
              alt={session?.user?.name ?? "Admin"}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
