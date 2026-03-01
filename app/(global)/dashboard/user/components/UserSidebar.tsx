"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  HiViewGrid,
  HiShoppingBag,
  HiUser,
  HiHeart,
  HiLocationMarker,
  HiStar,
  HiLogout,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard", icon: HiViewGrid, href: "/dashboard/user" },
  { label: "My Orders", icon: HiShoppingBag, href: "/dashboard/user/orders" },
  { label: "Profile", icon: HiUser, href: "/dashboard/user/profile" },
  { label: "Wishlist", icon: HiHeart, href: "/dashboard/user/wishlist" },
  {
    label: "Addresses",
    icon: HiLocationMarker,
    href: "/dashboard/user/addresses",
  },
  { label: "Reviews", icon: HiStar, href: "/dashboard/user/reviews" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface UserSidebarProps {
  children: React.ReactNode;
}

export default function UserSidebar({ children }: UserSidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  const sidebarW = expanded ? "w-56" : "w-[60px]";
  const offsetW = expanded ? "pl-56" : "pl-[60px]";

  return (
    <div
      className={`relative min-h-screen transition-all duration-300 ${offsetW}`}
    >
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-40 overflow-hidden ${sidebarW}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <Image
              src="/logo.png"
              width={26}
              height={26}
              alt="Belilar"
              className="flex-shrink-0"
            />
            {expanded && (
              <span className="text-base font-black text-gray-900 tracking-tight truncate">
                Belilar
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-150 flex-shrink-0"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? (
              <HiChevronLeft className="text-sm" />
            ) : (
              <HiChevronRight className="text-sm" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
            const isActive =
              href === "/dashboard/user"
                ? pathname === href
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                title={!expanded ? label : undefined}
                className={`flex items-center gap-3 h-9 px-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon
                  className={`text-base flex-shrink-0 ${
                    isActive ? "text-primary-600" : "text-gray-400"
                  }`}
                />
                {expanded && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-2.5 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={() => signOut()}
            title={!expanded ? "Sign Out" : undefined}
            className="w-full flex items-center gap-3 h-9 px-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <HiLogout className="text-base flex-shrink-0 text-gray-400" />
            {expanded && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Page content ─────────────────────────────────────────────────────── */}
      {children}
    </div>
  );
}
