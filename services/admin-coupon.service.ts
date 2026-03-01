import Stripe from "stripe";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StripeCoupon = Stripe.Coupon;
export type StripePromoCode = Stripe.PromotionCode;

export type CouponType = "percent" | "fixed";

export interface CreateCouponPayload {
  name: string;
  code: string;
  type: CouponType;
  percent_off?: number;
  amount_off?: number; // in cents
  currency?: string; // default "aud"
  max_redemptions?: number;
  expires_at?: string; // ISO date string
}

export interface CouponDetail {
  coupon: StripeCoupon;
  promoCodes: StripePromoCode[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** GET /api/admin/coupon */
export const getAdminCoupons = async (): Promise<{
  coupons: StripeCoupon[];
}> => {
  const res = await fetch("/api/admin/coupon", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch coupons.");
  return data;
};

/** GET /api/admin/coupon/[id] */
export const getAdminCoupon = async (id: string): Promise<CouponDetail> => {
  const res = await fetch(`/api/admin/coupon/${id}`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to fetch coupon.");
  return data;
};

/** POST /api/admin/coupon */
export const createAdminCoupon = async (
  payload: CreateCouponPayload,
): Promise<{ coupon: StripeCoupon; promoCode: StripePromoCode }> => {
  const res = await fetch("/api/admin/coupon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to create coupon.");
  return data;
};

/** DELETE /api/admin/coupon/[id] */
export const deleteAdminCoupon = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await fetch(`/api/admin/coupon/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Failed to delete coupon.");
  return data;
};
