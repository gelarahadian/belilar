"use client";

import Link from "next/link";
import { HiArrowLeft, HiShoppingCart } from "react-icons/hi";
import CheckoutForm from "./CheckoutForm";
import { useCart } from "@/hooks/use-cart";

export default function CheckoutPageClient() {
  const { data: cart, isLoading } = useCart();

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // ── Empty (fallback) ─────────────────────────────────────────────────────────
  if (!cart?.items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <HiShoppingCart className="text-3xl text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-4">
          Your cart is empty
        </p>
        <Link
          href="/"
          className="text-sm font-bold text-primary-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors duration-150 mb-6"
      >
        <HiArrowLeft className="text-base" />
        Back to Cart
      </Link>

      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
        <p className="text-sm text-gray-400 mt-1">
          Review your order and complete payment
        </p>
      </div>

      {/* Checkout form (summary + coupon + pay) */}
      <CheckoutForm items={cart.items} subtotal={cart.total} />
    </main>
  );
}
