import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// ─── GET /api/admin/coupon/[id] ───────────────────────────────────────────────
// Returns coupon + all its promotion codes

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const [coupon, promoCodes] = await Promise.all([
      stripe.coupons.retrieve(params.id),
      stripe.promotionCodes.list({ coupon: params.id, limit: 100 }),
    ]);

    return NextResponse.json(
      { coupon, promoCodes: promoCodes.data },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[ADMIN_COUPON_GET_ID]", error);
    if (error?.statusCode === 404) {
      return NextResponse.json(
        { message: "Coupon not found." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/admin/coupon/[id] ────────────────────────────────────────────
// Deletes coupon from Stripe (also deactivates all promo codes)

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    await stripe.coupons.del(params.id);

    return NextResponse.json({ message: "Coupon deleted." }, { status: 200 });
  } catch (error: any) {
    console.error("[ADMIN_COUPON_DELETE]", error);
    if (error?.statusCode === 404) {
      return NextResponse.json(
        { message: "Coupon not found." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
