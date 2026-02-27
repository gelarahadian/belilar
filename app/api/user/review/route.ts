import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── GET /api/user/review ─────────────────────────────────────────────────────
// Returns:
//   - reviews: all reviews written by user
//   - reviewable: products from delivered orders that haven't been reviewed yet

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const userId = session.user.id;

    const [reviews, deliveredOrders] = await Promise.all([
      // All reviews written by user
      prisma.review.findMany({
        where: { userId },
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
        orderBy: { createdAt: "desc" },
      }),

      // Orders with status delivered
      prisma.order.findMany({
        where: {
          userId,
          deliveryStatus: "Delivered",
        },
        include: {
          items: {
            select: {
              productId: true,
              title: true,
              image: true,
            },
          },
        },
      }),
    ]);

    // Collect unique productIds from delivered orders
    const reviewedProductIds = new Set(reviews.map((r) => r.productId));

    const reviewableMap = new Map<
      string,
      { productId: string; title: string; image: string }
    >();

    for (const order of deliveredOrders) {
      for (const item of order.items) {
        // Only include if not yet reviewed and not already in map
        if (
          !reviewedProductIds.has(item.productId) &&
          !reviewableMap.has(item.productId)
        ) {
          reviewableMap.set(item.productId, {
            productId: item.productId,
            title: item.title,
            image: item.image,
          });
        }
      }
    }

    return NextResponse.json(
      {
        reviews,
        reviewable: Array.from(reviewableMap.values()),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[REVIEW_GET]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
