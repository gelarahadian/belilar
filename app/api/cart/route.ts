import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// ─── GET /api/cart ─────────────────────────────────────────────────────────────
// Returns the current user's cart with all items and product details

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                previousPrice: true,
                images: true,
                stock: true,
                brand: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // Return empty cart shape if not created yet
    if (!cart) {
      return NextResponse.json(
        { id: null, items: [], total: 0 },
        { status: 200 },
      );
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return NextResponse.json({ ...cart, total }, { status: 200 });
  } catch (error) {
    console.error("[CART_GET]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── POST /api/cart ────────────────────────────────────────────────────────────
// Add a product to cart. Creates cart if it doesn't exist.
// Body: { productId: string, quantity: number }

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity } = body ?? {};

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { message: "productId and quantity (≥ 1) are required." },
        { status: 400 },
      );
    }

    // Verify product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true, title: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    if (product.stock !== null && product.stock < quantity) {
      return NextResponse.json(
        { message: `Only ${product.stock} item(s) left in stock.` },
        { status: 409 },
      );
    }

    // Upsert cart
    const cart = await prisma.cart.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    });

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    let cartItem;

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;

      if (product.stock !== null && newQty > product.stock) {
        return NextResponse.json(
          { message: `Only ${product.stock} item(s) available.` },
          { status: 409 },
        );
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
        include: { product: true },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("[CART_POST]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
