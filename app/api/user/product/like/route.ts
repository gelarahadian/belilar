import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── PUT /api/user/product/like ───────────────────────────────────────────────
// Body: { product_id: string }
// Toggle like — if exists: remove, if not: create

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { product_id } = await req.json();

    if (!product_id) {
      return NextResponse.json(
        { message: "product_id is required." },
        { status: 400 },
      );
    }

    // Check product exists
    const product = await prisma.product.findUnique({
      where: { id: product_id },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    // Check if already liked
    const existing = await prisma.like.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product_id,
        },
      },
    });

    if (existing) {
      // Unlike — remove
      await prisma.like.delete({
        where: { id: existing.id },
      });

      return NextResponse.json(
        { message: "Product unliked.", liked: false },
        { status: 200 },
      );
    } else {
      // Like — create
      await prisma.like.create({
        data: {
          userId: session.user.id,
          productId: product_id,
        },
      });

      return NextResponse.json(
        { message: "Product liked.", liked: true },
        { status: 200 },
      );
    }
  } catch (error: any) {
    console.error("[PRODUCT_LIKE]", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error." },
      { status: 500 },
    );
  }
}
