import { PrismaClient } from "@prisma/client";
import queryString from "query-string";

export async function GET(req: Request) {
  const prisma = new PrismaClient();
  const searchParams = queryString.parseUrl(req.url).query;
  const { page } = searchParams || {};
  const pageSize = 3;

  try {
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const totalProducts = await prisma.order.count();
    const totalPages = Math.ceil(totalProducts / pageSize);
    console.log(totalProducts);
    console.log(totalPages);
    const orders = await prisma.order.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        cartItems: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return Response.json({ orders, currentPage, totalPages }, { status: 200 });
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}
