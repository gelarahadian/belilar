"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import ProductSearchForm from "./ProductSearchForm";
import Cart from "./Cart";
import AuthButton from "./AuthButton";
import UserMenu from "./UserMenu";

export default function Header() {
  const { status } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" width={28} height={28} alt="Belilar" />
            <span className="text-base font-black text-gray-900 group-hover:text-primary-600 transition-colors duration-150 tracking-tight">
              Belilar
            </span>
          </Link>

          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 font-medium hover:text-primary-600 transition-colors duration-150"
          >
            <HiOutlineShoppingBag className="text-base" />
            Shop
          </Link>
        </div>

        {/* ── Search ───────────────────────────────────────────────────────── */}
        <div className="flex-1">
          <ProductSearchForm />
        </div>

        {/* ── Right ────────────────────────────────────────────────────────── */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <Cart />

          {status === "loading" ? (
            <div className="w-24 h-9 rounded-xl bg-gray-100 animate-pulse" />
          ) : status === "authenticated" ? (
            <UserMenu />
          ) : (
            <AuthButton />
          )}
        </div>
      </div>
    </header>
  );
}
