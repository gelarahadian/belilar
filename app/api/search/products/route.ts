import { PrismaClient } from "@prisma/client";
import queryString from "query-string";

export async function GET(req: Request) {
  const { productSearchQuery } = queryString.parseUrl(req.url).query;
  // Ensure productQueryString is a string
  const searchQuery = Array.isArray(productSearchQuery)
    ? productSearchQuery[0]
    : productSearchQuery;

  console.log(productSearchQuery);

  const prisma = new PrismaClient();

  try {
    const [categories, tags] = await prisma.$transaction([
      prisma.category.findMany({
        where: {
          name: {
            contains: searchQuery || undefined,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
        },
      }),
      prisma.tag.findMany({
        where: {
          name: {
            contains: searchQuery || undefined,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
        },
      }),
    ]);

    const categoryIds = categories.map((c) => c.id);
    const tagIds = tags.map((t) => t.id);

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchQuery || undefined,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchQuery || undefined,
              mode: "insensitive",
            },
          },
          {
            categoryId: { in: categoryIds },
          },
          //   {
          //     tagIDs: {
          //       hasSome: tagIds,
          //     },
          //   },
        ],
      },
      include: {
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
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return Response.json({ products }, { status: 200 });
  } catch (err: any) {
    console.log(err);
    return Response.json({ message: err.message }, { status: 200 });
  }
}
