// ─── Keys ─────────────────────────────────────────────────────────────────────

export const adminCouponKeys = {
  all: ["admin-coupons"] as const,
  list: () => [...adminCouponKeys.all, "list"] as const,
  detail: (id: string) => [...adminCouponKeys.all, "detail", id] as const,
};
