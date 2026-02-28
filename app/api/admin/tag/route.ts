import slugify from "slugify";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── GET /api/admin/tag ───────────────────────────────────────────────────────

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const tags = await prisma.tag.findMany({
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { products: true } },
      },
      orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
    });

    return NextResponse.json({ tags }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_TAG_GET]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── POST /api/admin/tag ──────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { name, categoryId } = await req.json();

    if (!name?.trim() || !categoryId) {
      return NextResponse.json(
        { message: "Name and categoryId are required." },
        { status: 400 },
      );
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await prisma.tag.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { message: "Tag already exists." },
        { status: 409 },
      );
    }

    const tag = await prisma.tag.create({
      data: { name: name.trim(), slug, categoryId },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_TAG_POST]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
