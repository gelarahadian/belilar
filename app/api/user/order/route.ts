import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// ─── GET /api/user/order ──────────────────────────────────────────────────────

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: {
            id: true,
            productId: true,
            title: true,
            price: true,
            image: true,
            quantity: true,
          },
        },
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("[ORDER_LIST]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
