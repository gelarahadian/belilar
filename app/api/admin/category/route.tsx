import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

export async function POST(req: Request) {
  const body = await req.json();
  const { name } = body;

  const prisma = new PrismaClient();

  try {
    const existingCategory = await prisma.category.findUnique({
      where: {
        slug: slugify(name, { lower: true }),
      },
    });

    if (existingCategory) {
      return Response.json(`Tag with name ${name} already exists`, {
        status: 409,
      });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name,
        slug: slugify(name, { lower: true }),
      },
    });

    return Response.json({ newCategory });
  } catch (err: any) {
    console.log(err);
    return Response.json(err.message, { status: 500 });
  }
}

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
