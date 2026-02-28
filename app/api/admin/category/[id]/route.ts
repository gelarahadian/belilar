import slugify from "slugify";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── PATCH /api/admin/category/[id] ──────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 },
      );
    }

    const slug = slugify(name, { lower: true, strict: true });

    const conflict = await prisma.category.findFirst({
      where: { slug, id: { not: params.id } },
    });
    if (conflict) {
      return NextResponse.json(
        { message: "Category name already taken." },
        { status: 409 },
      );
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: { name: name.trim(), slug, updatedAt: new Date() },
      include: {
        tags: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_CATEGORY_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/admin/category/[id] ─────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const productCount = await prisma.product.count({
      where: { categoryId: params.id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete — ${productCount} product(s) use this category.`,
        },
        { status: 400 },
      );
    }

    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Category deleted." }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_CATEGORY_DELETE]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
