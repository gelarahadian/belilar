import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── GET /api/user/wishlist ───────────────────────────────────────────────────

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const likes = await prisma.like.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            previousPrice: true,
            brand: true,
            stock: true,
            images: true,
            category: { select: { id: true, name: true } },
            reviews: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ likes }, { status: 200 });
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
