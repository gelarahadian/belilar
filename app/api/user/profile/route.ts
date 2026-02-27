// ─── GET /api/user/profile ────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── PATCH /api/user/profile ──────────────────────────────────────────────────
// Update name and/or image

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { name, image } = body;

    if (!name?.trim() && !image) {
      return NextResponse.json(
        { message: "Nothing to update." },
        { status: 400 },
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name?.trim() ? { name: name.trim() } : {}),
        ...(image ? { image } : {}),
        updatedAt: new Date(),
      },
      select: { id: true, name: true, email: true, image: true },
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (error) {
    console.error("[PROFILE_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
