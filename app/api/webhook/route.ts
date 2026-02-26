import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, DeliveryStatus } from "@prisma/client";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ─── POST /api/webhook ────────────────────────────────────────────────────────
// Must be raw body — do NOT use NextRequest.json()

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  // ── Verify webhook signature ────────────────────────────────────────────────
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    console.error("[WEBHOOK_SIG_ERROR]", err.message);
    return NextResponse.json(
      { message: `Webhook signature verification failed: ${err.message}` },
      { status: 400 },
    );
  }

  // ── Handle events ───────────────────────────────────────────────────────────
  try {
    switch (event.type) {
      case "charge.succeeded": {
        await handleChargeSucceeded(event.data.object);
        break;
      }

      case "charge.refunded": {
        await handleChargeRefunded(event.data.object);
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    console.error("[WEBHOOK_HANDLER]", error);
    return NextResponse.json(
      { message: "Webhook handler failed." },
      { status: 500 },
    );
  }
}

// ─── charge.succeeded ─────────────────────────────────────────────────────────

async function handleChargeSucceeded(charge: any) {
  const {
    id: chargeId,
    payment_intent,
    receipt_url,
    refunded,
    amount_captured,
    currency,
    shipping,
    metadata,
  } = charge;

  const { cartItems: rawCartItems, userId } = metadata;
  const cartItems: { id: string; quantity: number }[] =
    JSON.parse(rawCartItems);
  const productIds = cartItems.map((item) => item.id);

  // ── Fetch products ────────────────────────────────────────────────────────
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, title: true, price: true, images: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  // ── Build shipping address from Stripe object ─────────────────────────────
  const shippingAddress = {
    address: {
      city: shipping?.address?.city ?? "",
      country: shipping?.address?.country ?? "",
      line1: shipping?.address?.line1 ?? "",
      line2: shipping?.address?.line2 ?? "",
      postal_code: shipping?.address?.postal_code ?? "",
      state: shipping?.address?.state ?? "",
    },
  };

  // ── Create Order + OrderItems in a transaction ────────────────────────────
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        chargeId,
        payment_intent,
        receipt_url,
        refunded,
        status: OrderStatus.paid,
        amount_captured,
        currency,
        shipping: shippingAddress,
        deliveryStatus: DeliveryStatus.NotProcessed,
        user: { connect: { id: userId } },
        items: {
          create: cartItems.map((item) => {
            const product = productMap.get(item.id);
            const image =
              (product?.images?.[0] as { secure_url?: string })?.secure_url ??
              "";
            return {
              productId: item.id,
              title: product?.title ?? "Unknown",
              price: product?.price ?? 0,
              image,
              quantity: item.quantity,
            };
          }),
        },
      },
    });

    // ── Decrement stock for each product ──────────────────────────────────
    await Promise.all(
      cartItems.map((item) =>
        tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        }),
      ),
    );

    // ── Clear user cart ───────────────────────────────────────────────────
    const cart = await tx.cart.findUnique({ where: { userId } });
    if (cart) {
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    console.log(`[WEBHOOK] Order created: ${order.id}`);
  });
}

// ─── charge.refunded ──────────────────────────────────────────────────────────

async function handleChargeRefunded(charge: any) {
  const { id: chargeId, refund } = charge;

  const order = await prisma.order.findFirst({ where: { chargeId } });
  if (!order) {
    console.warn(`[WEBHOOK] Order not found for chargeId: ${chargeId}`);
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      refunded: true,
      refundId: refund?.id ?? null,
      status: OrderStatus.refunded,
      deliveryStatus: DeliveryStatus.Refunded,
    },
  });

  console.log(`[WEBHOOK] Order refunded: ${order.id}`);
}
