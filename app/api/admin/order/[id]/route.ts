import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// ─── GET /api/admin/order/[id] ────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_ORDER_GET_ID]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── PATCH /api/admin/order/[id] — update delivery status ────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { deliveryStatus } = await req.json();

    const validStatuses = [
      "NotProcessed",
      "Processing",
      "Dispatched",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(deliveryStatus)) {
      return NextResponse.json(
        { message: "Invalid delivery status." },
        { status: 400 },
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      select: { id: true, status: true, refunded: true },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 },
      );
    }

    if (order.refunded) {
      return NextResponse.json(
        { message: "Cannot update status of a refunded order." },
        { status: 400 },
      );
    }

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { deliveryStatus, updatedAt: new Date() },
    });

    return NextResponse.json({ order: updated }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_ORDER_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── POST /api/admin/order/[id]/refund — manual refund ───────────────────────

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: { select: { productId: true, quantity: true } } },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 },
      );
    }

    if (order.refunded) {
      return NextResponse.json(
        { message: "Order has already been refunded." },
        { status: 409 },
      );
    }

    if (order.status !== "paid") {
      return NextResponse.json(
        { message: "Only paid orders can be refunded." },
        { status: 400 },
      );
    }

    // Create Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: order.payment_intent,
      reason: "requested_by_customer",
    });

    // Transaction: update order + restore stock
    await prisma.$transaction([
      prisma.order.update({
        where: { id: params.id },
        data: {
          refunded: true,
          status: "refunded",
          deliveryStatus: "Refunded",
          refundId: refund.id,
          updatedAt: new Date(),
        },
      }),
      ...order.items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        }),
      ),
    ]);

    return NextResponse.json(
      { message: "Order refunded successfully.", refundId: refund.id },
      { status: 200 },
    );
  } catch (error) {
    console.error("[ADMIN_ORDER_REFUND]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
