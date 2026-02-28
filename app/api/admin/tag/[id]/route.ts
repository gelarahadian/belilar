import slugify from "slugify";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── PATCH /api/admin/tag/[id] ────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { name, categoryId } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 },
      );
    }

    const slug = slugify(name, { lower: true, strict: true });
    const conflict = await prisma.tag.findFirst({
      where: { slug, id: { not: params.id } },
    });
    if (conflict) {
      return NextResponse.json(
        { message: "Tag name already taken." },
        { status: 409 },
      );
    }

    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        slug,
        ...(categoryId && { categoryId }),
        updatedAt: new Date(),
      },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ tag }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_TAG_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/admin/tag/[id] ───────────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    await prisma.tag.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Tag deleted." }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_TAG_DELETE]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
