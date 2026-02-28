import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── PATCH /api/admin/product/[id] ───────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const existing = await prisma.product.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      price,
      previousPrice,
      brand,
      stock,
      shipping,
      color,
      categoryId,
      tagIds,
      images,
    } = body;

    // Re-generate slug only if title changed
    let slug = existing.slug;
    if (title && title !== existing.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      const conflict = await prisma.product.findFirst({
        where: { slug, id: { not: params.id } },
      });
      if (conflict) {
        return NextResponse.json(
          { message: "A product with this title already exists." },
          { status: 409 },
        );
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title, slug }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(previousPrice !== undefined && {
          previousPrice: previousPrice ? Number(previousPrice) : null,
        }),
        ...(brand !== undefined && { brand }),
        ...(stock !== undefined && {
          stock: stock !== "" ? Number(stock) : null,
        }),
        ...(shipping !== undefined && {
          shipping: shipping !== "" ? Number(shipping) : null,
        }),
        ...(color !== undefined && { color }),
        ...(categoryId !== undefined && { categoryId }),
        ...(tagIds !== undefined && { tagIds }),
        ...(images !== undefined && { images }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_PRODUCT_PATCH]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/admin/product/[id] ──────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: { id: true, images: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    // Delete images from Cloudinary
    if (product.images?.length) {
      await Promise.all(
        (product.images as { public_id: string }[]).map((img) =>
          cloudinary.uploader.destroy(img.public_id),
        ),
      );
    }

    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Product deleted." }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_PRODUCT_DELETE]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
