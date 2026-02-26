"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckoutPayload, createSession, validateCoupon } from "@/services/checkout.service";

// ─── useCreateCheckoutSession ─────────────────────────────────────────────────
// Calls Stripe session endpoint → redirects to Stripe hosted checkout

export function useCreateCheckoutSession() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) =>
      createSession(payload),

    onSuccess: ({ url }) => {
      router.push(url); // redirect to Stripe
    },

    onError: (error: Error) => {
      toast.error(error.message ?? "Checkout failed. Please try again.");
    },
  });
}

// ─── useValidateCoupon ────────────────────────────────────────────────────────
// Validates coupon code on demand (not auto — triggered by user action)

export function useValidateCoupon() {
  return useMutation({
    mutationFn: (code: string) => validateCoupon(code),

    onError: () => {
      toast.error("Failed to validate coupon. Please try again.");
    },
  });
}
