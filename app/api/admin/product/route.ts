import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── GET /api/admin/product ───────────────────────────────────────────────────
// Query params: page, search, category, brand

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const brand = searchParams.get("brand") ?? "";
    const limit = 10;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) where.categoryId = category;
    if (brand) where.brand = { equals: brand, mode: "insensitive" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      {
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[ADMIN_PRODUCT_GET]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// ─── POST /api/admin/product ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
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

    if (!title || !description || !price || !brand || !categoryId) {
      return NextResponse.json(
        {
          message: "title, description, price, brand, categoryId are required.",
        },
        { status: 400 },
      );
    }

    // Auto-generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Check slug unique
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { message: "A product with this title already exists." },
        { status: 409 },
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: Number(price),
        previousPrice: previousPrice ? Number(previousPrice) : null,
        brand,
        stock: stock ? Number(stock) : null,
        shipping: shipping ? Number(shipping) : null,
        color: color ?? [],
        images: images ?? [],
        categoryId,
        tagIds: tagIds ?? [],
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_PRODUCT_POST]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
