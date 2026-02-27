import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Filter {
  category?: string;
  brand?: string;
  tag?: string;
  ratings?: number[];
  minPrice?: number;
  maxPrice?: number;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const search = searchParams.get("search")?.trim() || undefined;
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const ratings = searchParams.get("ratings") || undefined;
    const minPrice = searchParams.get("minPrice") || undefined;
    const maxPrice = searchParams.get("maxPrice") || undefined;

    const PAGE_SIZE = 6;
    const skip = (page - 1) * PAGE_SIZE;

    // ── Build where clause ────────────────────────────────────────────────────

    const where: NonNullable<
      Parameters<typeof prisma.product.findMany>[0]
    >["where"] = {
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lte: Number(maxPrice) } : {}),
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { brand: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),

      ...(category ? { categoryId: category } : {}),

      ...(brand ? { brand } : {}),

      ...(tag ? { tagIds: { has: tag } } : {}),
    };

    // ── Fetch all matching (for rating filter which can't be done in SQL) ────

    const allProducts = await prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
        reviews: { select: { rating: true } },
        likes: { select: { userId: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // ── Rating filter (post-query, computed field) ────────────────────────────

    const minRating = ratings ? Number(ratings) : null;

    const filteredProducts = minRating
      ? allProducts.filter((product) => {
          if (product.reviews.length === 0) return false;
          const avg =
            product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length;
          return avg >= minRating;
        })
      : allProducts;

    // ── Paginate ──────────────────────────────────────────────────────────────

    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / PAGE_SIZE) || 1;
    const products = filteredProducts.slice(skip, skip + PAGE_SIZE);

    return NextResponse.json(
      {
        products,
        currentPage: page,
        totalProducts,
        totalPages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PRODUCT_FILTERS]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
