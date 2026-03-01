"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAdminCoupons,
  getAdminCoupon,
  createAdminCoupon,
  deleteAdminCoupon,
  CreateCouponPayload,
  StripeCoupon,
} from "@/services/admin-coupon.service";
import { adminCouponKeys } from "./admin-coupon.keys";


// ─── useAdminCoupons ──────────────────────────────────────────────────────────

export function useAdminCoupons() {
  return useQuery({
    queryKey: adminCouponKeys.list(),
    queryFn: getAdminCoupons,
    staleTime: 1000 * 60 * 2,
  });
}

// ─── useAdminCoupon ───────────────────────────────────────────────────────────

export function useAdminCoupon(id: string) {
  return useQuery({
    queryKey: adminCouponKeys.detail(id),
    queryFn: () => getAdminCoupon(id),
    staleTime: 1000 * 60 * 2,
    enabled: !!id,
  });
}

// ─── useCreateAdminCoupon ─────────────────────────────────────────────────────

export function useCreateAdminCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCouponPayload) => createAdminCoupon(payload),

    onSuccess: (data) => {
      toast.success("Coupon created!");
      // Append new coupon to list cache
      queryClient.setQueryData<{ coupons: StripeCoupon[] }>(
        adminCouponKeys.list(),
        (old) => (old ? { coupons: [data.coupon, ...old.coupons] } : old),
      );
    },

    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── useDeleteAdminCoupon ─────────────────────────────────────────────────────

export function useDeleteAdminCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminCoupon(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminCouponKeys.list() });
      const snapshot = queryClient.getQueryData<{ coupons: StripeCoupon[] }>(
        adminCouponKeys.list(),
      );
      queryClient.setQueryData<{ coupons: StripeCoupon[] }>(
        adminCouponKeys.list(),
        (old) =>
          old ? { coupons: old.coupons.filter((c) => c.id !== id) } : old,
      );
      return { snapshot };
    },

    onError: (err: Error, _id, context) => {
      if (context?.snapshot)
        queryClient.setQueryData(adminCouponKeys.list(), context.snapshot);
      toast.error(err.message);
    },

    onSuccess: () => toast.success("Coupon deleted."),
  });
}
