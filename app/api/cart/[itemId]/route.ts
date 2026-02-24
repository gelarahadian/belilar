import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// ─── Helper: verify cart item ownership ───────────────────────────────────────

async function getOwnedCartItem(itemId: string, userId: string) {
  return prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId },
    },
    include: {
      product: { select: { stock: true } },
    },
  });
}

// ─── PATCH /api/cart/[itemId] ──────────────────────────────────────────────────
// Update quantity of a specific cart item
// Body: { quantity: number }

export async function PATCH(
  req: NextRequest,
  { params }: { params: { itemId: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const quantity = Number(body?.quantity);

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { message: "quantity must be a number ≥ 1." },
        { status: 400 },
      );
    }

    const cartItem = await getOwnedCartItem(params.itemId, session.user.id);
    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found." },
        { status: 404 },
      );
    }

    // Stock check
    if (cartItem.product.stock !== null && quantity > cartItem.product.stock) {
      return NextResponse.json(
        { message: `Only ${cartItem.product.stock} item(s) available.` },
        { status: 409 },
      );
    }

    const updated = await prisma.cartItem.update({
      where: { id: params.itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            stock: true,
          },
        },
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[CART_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/cart/[itemId] ─────────────────────────────────────────────────
// Remove a specific item from cart

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { itemId: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const cartItem = await getOwnedCartItem(params.itemId, session.user.id);
    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found." },
        { status: 404 },
      );
    }

    await prisma.cartItem.delete({ where: { id: params.itemId } });

    return NextResponse.json(
      { message: "Item removed from cart." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[CART_DELETE]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
