import { PrismaClient, Rating } from "@prisma/client";
import queryString from "query-string";

interface Filter {
  category?: string;
  brand?: string;
  tag?: string;
  ratings?: number[];
  minPrice?: number;
  maxPrice?: number;
}

export async function GET(req: Request) {
  const prisma = new PrismaClient();
  const searchParams = queryString.parseUrl(req.url).query;

  const { page, category, brand, tag, ratings, minPrice, maxPrice } =
    searchParams || {};
  const pageSize = 6;

  try {
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;

    const allProducts = await prisma.product.findMany({
      where: {
        price: {
          gte: Number(minPrice) || undefined,
          lte: Number(maxPrice) || undefined,
        },

        AND: [
          {
            categoryId: (category as string) || undefined,
          },
          {
            brand: (brand as string) || undefined,
          },
          {
            tagIds: tag
              ? {
                  has: Array.isArray(tag) ? tag[0] : tag || undefined,
                }
              : undefined,
          },
        ],
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    const calculateAverageRating = (ratings: { rating: number }[]) => {
      if (ratings.length === 0) return 0;
      let totalRating = 0;
      ratings.forEach((rating) => {
        totalRating += rating.rating;
      });

      return totalRating / ratings.length;
    };

    const productsWithAverageRating = allProducts.map((product) => ({
      ...product,
      averageRating: calculateAverageRating(product.ratings),
    }));

    const filteredProducts = productsWithAverageRating.filter((product) => {
      if (!ratings) {
        return true;
      }
      const targetRating = Number(ratings);
      const difference = product.averageRating - targetRating;
      return difference >= -0.5 && difference <= 0.5;
    });

    console.log(searchParams);

    const totalFilteredProducts = filteredProducts.length;

    const paginatedProducts = filteredProducts.slice(skip, skip + pageSize);

    return Response.json(
      {
        products: paginatedProducts,
        currentPage,
        totalProducts: totalFilteredProducts,
        totalPages: Math.ceil(totalFilteredProducts / pageSize),
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.log(err);
    return Response.json({ err: err.message }, { status: 500 });
  }
}
