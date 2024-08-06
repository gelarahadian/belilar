import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, categoryId } = body;

  const prisma = new PrismaClient();

  if (!categoryId) {
    return Response.json("Category Id Undefined", { status: 400 });
  }

  try {
    const existingTag = await prisma.tag.findUnique({
      where: {
        slug: slugify(name),
      },
    });

    if (existingTag) {
      return Response.json(`Tag with name ${name} already exists`, {
        status: 409,
      });
    }

    const tag = await prisma.tag.create({
      data: {
        name: name,
        slug: slugify(name),
        categoryId: categoryId,
      },
    });

    return Response.json({ tag });
  } catch (err: any) {
    console.log(err);
    return Response.json(err.message, { status: 500 });
  }
}

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json(tags);
  } catch (err: any) {
    console.log(err);
    return new Response(err.message, { status: 500 });
  }
}
