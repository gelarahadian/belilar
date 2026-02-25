import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

interface CartItemPayload {
  id: string; // CartItem.id
  quantity: number;
}

interface RequestBody {
  cartItems: CartItemPayload[];
  couponCode?: string;
}

// ─── POST /api/user/stripe/session ────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as RequestBody;
    const { cartItems, couponCode } = body;

    if (!cartItems?.length) {
      return NextResponse.json({ message: "Cart is empty." }, { status: 400 });
    }

    // ── Fetch products for all cart items in one query ────────────────────────
    const productIds = cartItems.map((item) => item.id);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        title: true,
        price: true,
        images: true,
        stock: true,
      },
    });

    // Map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // ── Validate stock & build Stripe line items ──────────────────────────────
    const lineItems = cartItems.map((item) => {
      const product = productMap.get(item.id);

      if (!product) {
        throw new Error(`Product ${item.id} not found.`);
      }

      if (product.stock !== null && product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for "${product.title}". Only ${product.stock} left.`,
        );
      }

      const imageUrl =
        (product.images[0] as { secure_url?: string })?.secure_url ?? "";

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: product.price, // price in cents
        },
        tax_rates: process.env.STRIPE_TAX_RATE
          ? [process.env.STRIPE_TAX_RATE]
          : [],
        quantity: item.quantity,
      };
    });

    // ── Create Stripe checkout session ────────────────────────────────────────
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: session.user.email,
      client_reference_id: session.user.id,

      // Pass cart + user to webhook via metadata
      payment_intent_data: {
        metadata: {
          cartItems: JSON.stringify(
            cartItems.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
          ),
          userId: session.user.id,
        },
      },

      shipping_address_collection: {
        allowed_countries: ["US", "ID", "AU", "GB", "SG", "MY"],
      },
      shipping_options: process.env.STRIPE_SHIPPING_RATE
        ? [{ shipping_rate: process.env.STRIPE_SHIPPING_RATE }]
        : [],

      ...(couponCode ? { discounts: [{ coupon: couponCode }] } : {}),

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/user/stripe/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error: any) {
    console.error("[STRIPE_SESSION]", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error." },
      { status: 500 },
    );
  }
}
