import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json({ categories });
  } catch (err: any) {
    console.log(err);
    return Response.json(err.message, { status: 500 });
  }
}