import { PrismaClient } from "@prisma/client";

export async function GET(req: Request, res: Response) {
  const prisma = new PrismaClient();
  try {
    const brands = await prisma.product.findMany({
      distinct: ["brand"],
      select: {
        brand: true,
      },
    });
    return Response.json(brands, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Error fetching brands" }, { status: 500 });
  }
}
