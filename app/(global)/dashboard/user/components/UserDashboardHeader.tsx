"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { HiOutlineShoppingBag, HiChevronRight } from "react-icons/hi";
import UserMenu from "@/app/components/Header/UserMenu";

export default function UserDashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 font-medium hover:text-primary-600 transition-colors duration-150"
          >
            <HiOutlineShoppingBag className="text-base" />
            Shop
          </Link>
        </div>

        {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center gap-1.5 text-sm text-gray-400 min-w-0">
          <HiChevronRight className="text-gray-300 flex-shrink-0" />
          <span className="font-semibold text-gray-500 truncate">
            {session?.user?.name ?? "My Account"}
          </span>
        </div>

        {/* ── Right ────────────────────────────────────────────────────────── */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
