import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── POST /api/user/review/submit ─────────────────────────────────────────────
// Body: { productId, rating, comment }
// Guard: user must have a delivered order containing this product

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating) {
      return NextResponse.json(
        { message: "productId and rating are required." },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5." },
        { status: 400 },
      );
    }

    // Guard — verify user has a delivered order containing this product
    const deliveredOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        deliveryStatus: "Delivered",
        items: {
          some: { productId },
        },
      },
    });

    if (!deliveredOrder) {
      return NextResponse.json(
        { message: "You can only review products from delivered orders." },
        { status: 403 },
      );
    }

    // Check already reviewed
    const existing = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "You have already reviewed this product." },
        { status: 409 },
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        comment: comment?.trim() || null,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
            brand: true,
          },
        },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("[REVIEW_SUBMIT]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
