import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// ─── GET /api/admin/coupon ────────────────────────────────────────────────────
// Fetches all coupons from Stripe

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const coupons = await stripe.coupons.list({ limit: 100 });

    return NextResponse.json({ coupons: coupons.data }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_COUPON_GET]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── POST /api/admin/coupon ───────────────────────────────────────────────────
// Body: { name, code, type, percent_off?, amount_off?, currency?, max_redemptions?, expires_at? }

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const {
      name,
      code,
      type,
      percent_off,
      amount_off,
      currency,
      max_redemptions,
      expires_at,
    } = await req.json();

    if (!name?.trim() || !code?.trim() || !type) {
      return NextResponse.json(
        { message: "name, code, and type are required." },
        { status: 400 },
      );
    }

    if (
      type === "percent" &&
      (!percent_off || percent_off < 1 || percent_off > 100)
    ) {
      return NextResponse.json(
        { message: "percent_off must be between 1 and 100." },
        { status: 400 },
      );
    }

    if (type === "fixed" && (!amount_off || amount_off < 1)) {
      return NextResponse.json(
        { message: "amount_off must be a positive number (in cents)." },
        { status: 400 },
      );
    }

    // Create coupon in Stripe
    const coupon = await stripe.coupons.create({
      name: name.trim(),
      duration: "once",
      ...(type === "percent"
        ? { percent_off: Number(percent_off) }
        : { amount_off: Number(amount_off), currency: currency ?? "aud" }),
      ...(max_redemptions && { max_redemptions: Number(max_redemptions) }),
      ...(expires_at && {
        redeem_by: Math.floor(new Date(expires_at).getTime() / 1000),
      }),
    });

    // Create promotion code (the actual code users type)
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: code.trim().toUpperCase(),
      ...(max_redemptions && { max_redemptions: Number(max_redemptions) }),
      ...(expires_at && {
        expires_at: Math.floor(new Date(expires_at).getTime() / 1000),
      }),
    });

    return NextResponse.json({ coupon, promoCode }, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_COUPON_POST]", error);

    // Stripe duplicate code error
    if (error?.code === "resource_already_exists") {
      return NextResponse.json(
        { message: "Coupon code already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
