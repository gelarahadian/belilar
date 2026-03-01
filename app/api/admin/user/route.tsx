import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── GET /api/admin/user ──────────────────────────────────────────────────────
// Query: page, search, role, banned

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const search = searchParams.get("search") ?? "";
    const role = searchParams.get("role") ?? "";
    const banned = searchParams.get("banned") ?? "";
    const limit = 10;

    const where: any = {};
    if (role) where.role = role;
    if (banned) where.banned = banned === "true";
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          banned: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: { orders: true, reviews: true, likes: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json(
      {
        users,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[ADMIN_USER_GET]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
