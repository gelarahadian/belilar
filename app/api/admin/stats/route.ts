import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      totalOrders,
      ordersThisMonth,
      ordersLastMonth,
      totalUsers,
      usersThisMonth,
      totalProducts,
      lowStockProducts,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      // Revenue — paid orders only
      prisma.order.aggregate({
        where: { status: "paid" },
        _sum: { amount_captured: true },
      }),
      prisma.order.aggregate({
        where: { status: "paid", createdAt: { gte: thisMonth } },
        _sum: { amount_captured: true },
      }),
      prisma.order.aggregate({
        where: {
          status: "paid",
          createdAt: { gte: lastMonth, lte: lastMonthEnd },
        },
        _sum: { amount_captured: true },
      }),

      // Orders
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: thisMonth } } }),
      prisma.order.count({
        where: { createdAt: { gte: lastMonth, lte: lastMonthEnd } },
      }),

      // Users
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thisMonth } } }),

      // Products
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 5 } } }),

      // Recent 5 orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, image: true } },
          items: { select: { title: true, quantity: true } },
        },
      }),

      // Top 5 products by order count
      prisma.orderItem.groupBy({
        by: ["productId", "title", "image"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

    // Revenue growth %
    const revThis = revenueThisMonth._sum.amount_captured ?? 0;
    const revLast = revenueLastMonth._sum.amount_captured ?? 0;
    const revenueGrowth =
      revLast > 0 ? Math.round(((revThis - revLast) / revLast) * 100) : null;

    const ordThis = ordersThisMonth;
    const ordLast = ordersLastMonth;
    const ordersGrowth =
      ordLast > 0 ? Math.round(((ordThis - ordLast) / ordLast) * 100) : null;

    return NextResponse.json(
      {
        revenue: {
          total: totalRevenue._sum.amount_captured ?? 0,
          thisMonth: revThis,
          growth: revenueGrowth,
        },
        orders: {
          total: totalOrders,
          thisMonth: ordersThisMonth,
          growth: ordersGrowth,
        },
        users: {
          total: totalUsers,
          thisMonth: usersThisMonth,
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
        },
        recentOrders: JSON.parse(JSON.stringify(recentOrders)),
        topProducts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
