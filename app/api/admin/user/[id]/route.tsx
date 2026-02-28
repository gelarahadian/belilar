import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── GET /api/admin/user/[id] ─────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        banned: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { orders: true, reviews: true, likes: true, addresses: true },
        },
        orders: {
          select: {
            id: true,
            amount_captured: true,
            status: true,
            deliveryStatus: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_USER_GET_ID]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── PATCH /api/admin/user/[id] ───────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    if (session.user.id === params.id) {
      return NextResponse.json(
        { message: "You cannot modify your own account." },
        { status: 400 },
      );
    }

    const { role, banned } = await req.json();
    const data: any = { updatedAt: new Date() };
    if (role !== undefined) data.role = role;
    if (banned !== undefined) data.banned = banned;

    const user = await prisma.user.update({
      where: { id: params.id },
      data,
      select: { id: true, name: true, email: true, role: true, banned: true },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_USER_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/admin/user/[id] ─────────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    if (session.user.id === params.id) {
      return NextResponse.json(
        { message: "You cannot delete your own account." },
        { status: 400 },
      );
    }

    const exists = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!exists) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "User deleted." }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_USER_DELETE]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
 