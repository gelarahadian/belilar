// ─── Types ────────────────────────────────────────────────────────────────────

export interface CheckoutCartItem {
  id: string;
  quantity: number;
}

export interface CheckoutPayload {
  cartItems: CheckoutCartItem[];
  couponCode?: string;
}

export interface CheckoutSessionResponse {
  url: string;
}

export interface CouponValidateResponse {
  valid: boolean;
  code?: string;
  message?: string;
  discount?: number; // percent_off  e.g. 20 = 20%
  amount_off?: number; // fixed amount in cents e.g. 500 = $5.00
  currency?: string;
  couponId?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/** POST /api/user/stripe/session — create Stripe checkout session */
export const createSession = async (
    payload: CheckoutPayload,
  ): Promise<CheckoutSessionResponse> => {
    const res = await fetch("/api/user/stripe/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message ?? "Failed to create checkout session.");
    return data;
}

/** POST /api/coupon/validate — validate coupon code before checkout */
export const validateCoupon = async (code: string): Promise<CouponValidateResponse> => {
const res = await fetch("/api/stripe/coupon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
});

const data = await res.json();
if (!res.ok)
    return { valid: false, message: data.message ?? "Invalid coupon." };
return data;
}
