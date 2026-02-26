import { NextRequest, NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ─── POST /api/coupon/validate ────────────────────────────────────────────────
// Stripe Promotion Code flow:
//   User types "SAVE20" → promotionCodes.list({ code }) → get underlying coupon
//   NOT coupons.retrieve() — that requires internal Coupon ID, not promo code

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = body?.code?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Coupon code is required." },
        { status: 400 },
      );
    }

    // ── Search by Promotion Code ──────────────────────────────────────────────
    const promoList = await stripe.promotionCodes.list({
      code, // exact match, case-insensitive on Stripe side
      active: true,
      limit: 1,
      expand: ["data.coupon"],
    });

    if (!promoList.data.length) {
      return NextResponse.json(
        { valid: false, message: "Coupon code not found." },
        { status: 200 },
      );
    }

    const promo = promoList.data[0];
    const coupon = promo.coupon;

    // ── Validate promo code state ─────────────────────────────────────────────

    if (!promo.active) {
      return NextResponse.json(
        { valid: false, message: "This coupon is no longer active." },
        { status: 200 },
      );
    }

    if (!coupon.valid) {
      return NextResponse.json(
        {
          valid: false,
          message: "This coupon has expired or is no longer valid.",
        },
        { status: 200 },
      );
    }

    // Check promo-level max redemptions
    if (
      promo.max_redemptions !== null &&
      promo.times_redeemed >= promo.max_redemptions
    ) {
      return NextResponse.json(
        { valid: false, message: "This coupon has reached its usage limit." },
        { status: 200 },
      );
    }

    // Check expiry date
    if (
      promo.expires_at !== null &&
      promo.expires_at < Math.floor(Date.now() / 1000)
    ) {
      return NextResponse.json(
        { valid: false, message: "This coupon has expired." },
        { status: 200 },
      );
    }

    // ── Return discount info ──────────────────────────────────────────────────
    return NextResponse.json({
      valid: true,
      code: promo.code, // original promo code string e.g. "SAVE20"
      couponId: coupon.id, // internal coupon ID — pass this to Stripe session
      discount: coupon.percent_off ?? null,
      amount_off: coupon.amount_off ?? null,
      currency: coupon.currency ?? null,
      message: coupon.percent_off
        ? `${coupon.percent_off}% off applied!`
        : `$${((coupon.amount_off ?? 0) / 100).toFixed(2)} off applied!`,
    });
  } catch (error) {
    console.error("[COUPON_VALIDATE]", error);
    return NextResponse.json(
      { valid: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
