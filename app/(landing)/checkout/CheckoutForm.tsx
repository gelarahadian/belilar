"use client";

import { useState } from "react";
import { HiLockClosed, HiCreditCard } from "react-icons/hi";
import { SiStripe } from "react-icons/si";
import { CartItemDetail } from "@/services/cart.service";
import { useCreateCheckoutSession } from "@/hooks/use-checkout";
import CouponInput, { AppliedCoupon } from "./CouponInput";
import OrderSummary from "./OrderSummary";

interface CheckoutFormProps {
  items: CartItemDetail[];
  subtotal: number; // in cents
}

export default function CheckoutForm({ items, subtotal }: CheckoutFormProps) {
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null,
  );
  const { mutate: createSession, isPending } = useCreateCheckoutSession();

  // ── Compute discount amount in cents ─────────────────────────────────────────
  const discountAmount = appliedCoupon
    ? appliedCoupon.discount
      ? Math.round((subtotal * appliedCoupon.discount) / 100) // percent_off
      : (appliedCoupon.amount_off ?? 0) // amount_off
    : 0;

  const handleCheckout = () => {
    createSession({
      cartItems: items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      })),
      couponCode: appliedCoupon?.couponId ?? undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* Order summary */}
      <OrderSummary
        items={items}
        subtotal={subtotal}
        discount={discountAmount}
        shipping={0}
      />

      {/* Coupon */}
      <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4">
        <CouponInput
          onApply={setAppliedCoupon}
          onRemove={() => setAppliedCoupon(null)}
          appliedCoupon={appliedCoupon}
        />
      </div>

      {/* Pay button */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isPending || items.length === 0}
        className="w-full h-12 flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary-900 active:bg-primary text-white font-bold rounded-2xl transition-colors duration-150 shadow-lg shadow-primary-600/25 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Redirecting to Stripe…
          </>
        ) : (
          <>
            <HiCreditCard className="text-lg" />
            Pay with Stripe
          </>
        )}
      </button>

      {/* Trust signals */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <HiLockClosed className="text-sm" />
          Secure checkout
        </span>
        <span className="text-gray-200">|</span>
        <span className="flex items-center gap-1">
          <SiStripe className="text-sm text-[#635BFF]" />
          Powered by Stripe
        </span>
      </div>
    </div>
  );
}
