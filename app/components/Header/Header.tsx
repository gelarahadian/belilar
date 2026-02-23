"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import ProductSearchForm from "./ProductSearchForm";
import Cart from "./Cart";
import AuthButton from "./AuthButton";
import { HiOutlineShoppingBag } from "react-icons/hi";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm shadow-gray-100/80">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* ── Logo + Nav ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center overflow-hidden shadow-md shadow-primary-600/30 group-hover:shadow-primary-600/50 transition-shadow duration-200">
              <Image
                src="/logo.png"
                width={22}
                height={22}
                alt="Belilar"
                className="flex-shrink-0"
              />
            </div>
            <span className="text-lg font-black tracking-tight text-gray-900 group-hover:text-primary-700 transition-colors duration-150">
              Belilar
            </span>
          </Link>

          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors duration-150"
          >
            <HiOutlineShoppingBag className="text-base" />
            Shop
          </Link>
        </div>

        {/* ── Search ──────────────────────────────────────────────────────── */}
        <div className="flex-1">
          <ProductSearchForm />
        </div>

        {/* ── Right Actions ────────────────────────────────────────────────── */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <Cart />

          {status === "loading" ? (
            <div className="flex gap-2">
              <div className="w-20 h-8 rounded-xl bg-gray-100 animate-pulse" />
              <div className="w-20 h-8 rounded-xl bg-gray-100 animate-pulse" />
            </div>
          ) : status === "authenticated" ? (
            <div className="flex items-center gap-3">
              {/* User avatar */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                  {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="text-sm font-semibold text-gray-700 max-w-[80px] truncate">
                  {session?.user?.name?.split(" ")[0]}
                </span>
              </div>
              {/* Logout */}
              <button
                onClick={() => signOut()}
                className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors duration-150 px-2 py-1.5 rounded-lg hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <AuthButton />
          )}
        </div>
      </div>
    </header>
  );
}
