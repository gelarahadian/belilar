import { PrismaClient } from "@prisma/client";
import queryString from "query-string";

export async function GET(req: Request, res: Response) {
  const prisma = new PrismaClient();
  const searchParams = queryString.parseUrl(req.url).query;
  const { page } = searchParams;
  const pageSize = 6;

  try {
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / pageSize);
    const products = await prisma.product.findMany({
      skip: skip,
      take: pageSize,
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
        reviews: {
          select: {
            rating: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    console.log(products);
    return Response.json(
      {
        currentPage: currentPage,
        totalProducts,
        totalPages,
        products: products,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return Response.json(err.message, { status: 500 });
  }
}
