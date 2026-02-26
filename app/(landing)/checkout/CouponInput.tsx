"use client";

import { useState } from "react";
import { HiTag, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { useValidateCoupon } from "@/hooks/use-checkout";
import toast from "react-hot-toast";

export interface AppliedCoupon {
  code: string;
  discount?: number; // percent_off
  amount_off?: number; // fixed in cents
  couponId?: string;
}

interface CouponInputProps {
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
  appliedCoupon: AppliedCoupon | null;
}

export default function CouponInput({
  onApply,
  onRemove,
  appliedCoupon,
}: CouponInputProps) {
  const [input, setInput] = useState("");
  const { mutate: validate, isPending } = useValidateCoupon();

  const handleApply = () => {
    if (!input.trim()) return;
    validate(input.trim().toUpperCase(), {
      onSuccess: (data) => {
        if (!data.valid) {
          toast.error(data.message ?? "Invalid coupon.");
          return;
        }
        toast.success(data.message ?? "Coupon applied!");
        onApply({
          code: data.code ?? input.trim().toUpperCase(),
          discount: data.discount,
          amount_off: data.amount_off,
          couponId: data.couponId,
        });
        setInput("");
      },
    });
  };

  const discountLabel = appliedCoupon
    ? appliedCoupon.discount
      ? `${appliedCoupon.discount}% OFF`
      : appliedCoupon.amount_off
        ? `$${(appliedCoupon.amount_off / 100).toFixed(2)} OFF`
        : "Applied"
    : "";

  // ── Applied state ────────────────────────────────────────────────────────────
  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl">
        <div className="flex items-center gap-2">
          <HiCheckCircle className="text-secondary-500 text-base flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-secondary-700 font-mono">
              {appliedCoupon.code}
            </p>
            <p className="text-[10px] text-secondary-500">
              {discountLabel} applied
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-secondary-400 hover:text-red-500 transition-colors duration-150"
          aria-label="Remove coupon"
        >
          <HiXCircle className="text-lg" />
        </button>
      </div>
    );
  }

  // ── Input state ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
        <HiTag className="text-gray-400" />
        Coupon Code
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          placeholder="Enter code"
          className="flex-1 h-10 px-3.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 placeholder:text-gray-400 font-mono uppercase tracking-widest"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={isPending || !input.trim()}
          className="h-10 px-4 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
          ) : (
            "Apply"
          )}
        </button>
      </div>
    </div>
  );
}
