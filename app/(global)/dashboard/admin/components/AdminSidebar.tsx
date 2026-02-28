"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  HiViewGrid,
  HiShoppingBag,
  HiClipboardList,
  HiUsers,
  HiTag,
  HiTicket,
  HiLogout,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard", icon: HiViewGrid, href: "/dashboard/admin" },
  { label: "Products", icon: HiShoppingBag, href: "/dashboard/admin/products" },
  { label: "Orders", icon: HiClipboardList, href: "/dashboard/admin/orders" },
  { label: "Users", icon: HiUsers, href: "/dashboard/admin/users" },
  { label: "Categories", icon: HiTag, href: "/dashboard/admin/categories" },
  { label: "Coupons", icon: HiTicket, href: "/dashboard/admin/coupons" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface AdminSidebarProps {
  children: React.ReactNode;
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
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
        className={`fixed left-0 top-0 h-full bg-gray-950 flex flex-col transition-all duration-300 z-40 overflow-hidden ${sidebarW}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 flex-shrink-0">
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-2.5 min-w-0"
          >
            <Image
              src="/logo.png"
              width={26}
              height={26}
              alt="Belilar"
              className="flex-shrink-0"
            />
            {expanded && (
              <div className="min-w-0">
                <span className="text-base font-black text-white tracking-tight truncate block">
                  Belilar
                </span>
                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                  Admin
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-150 flex-shrink-0"
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
              href === "/dashboard/admin"
                ? pathname === href
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                title={!expanded ? label : undefined}
                className={`flex items-center gap-3 h-9 px-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="text-base flex-shrink-0" />
                {expanded && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-2.5 py-4 border-t border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            title={!expanded ? "Sign Out" : undefined}
            className="w-full flex items-center gap-3 h-9 px-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-red-400 hover:bg-white/10 transition-all duration-150"
          >
            <HiLogout className="text-base flex-shrink-0" />
            {expanded && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Page content ─────────────────────────────────────────────────────── */}
      {children}
    </div>
  );
}
