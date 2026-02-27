"use client";

import { useRef, useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  HiShoppingBag,
  HiLogout,
  HiChevronDown,
  HiUser,
  HiHeart,
  HiLocationMarker,
  HiStar,
  HiViewGrid,
} from "react-icons/hi";

// ─── Sync dengan UserSidebar NAV_ITEMS ────────────────────────────────────────

const MENU_ITEMS = [
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

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = session?.user?.name?.[0]?.toUpperCase() ?? "U";
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div ref={ref} className="relative">
      {/* ── Trigger ──────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-9 px-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all duration-150"
      >
        <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
          {initial}
        </div>
        <span className="text-sm font-semibold text-gray-700 max-w-[72px] truncate">
          {firstName}
        </span>
        <HiChevronDown
          className={`text-gray-400 text-sm transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Dropdown ─────────────────────────────────────────────────────── */}
      {open && (
        <div className="absolute right-0 top-11 w-52 bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-200/60 overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-900 truncate">
              {session?.user?.name}
            </p>
            <p className="text-[11px] text-gray-400 truncate mt-0.5">
              {session?.user?.email}
            </p>
          </div>

          {/* Nav items */}
          <div className="py-1.5">
            {MENU_ITEMS.map(({ label, icon: Icon, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
              >
                <Icon className="text-base text-gray-400 flex-shrink-0" />
                {label}
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div className="border-t border-gray-100 py-1.5">
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150"
            >
              <HiLogout className="text-base flex-shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
