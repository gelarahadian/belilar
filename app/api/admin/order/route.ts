import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── GET /api/admin/order ─────────────────────────────────────────────────────
// Query params: page, search, status, deliveryStatus

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status") ?? "";
    const deliveryStatus = searchParams.get("deliveryStatus") ?? "";
    const limit = 10;

    const where: any = {};

    if (status) where.status = status;
    if (deliveryStatus) where.deliveryStatus = deliveryStatus;
    if (search) {
      where.OR = [
        { chargeId: { contains: search, mode: "insensitive" } },
        { payment_intent: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          items: {
            select: { title: true, image: true, price: true, quantity: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json(
      {
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[ADMIN_ORDER_GET]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
