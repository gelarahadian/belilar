import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    title,
    description,
    price,
    previousPrice,
    color,
    brand,
    images,
    categoryId,
    tagIDs,
  } = body;

  const prisma = new PrismaClient();

  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        slug: slugify(title),
      },
    });

    if (existingProduct) {
      return Response.json(`Product with title ${title} already exists`, {
        status: 409,
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        title: title,
        slug: slugify(title, { lower: true }),
        description: description,
        price: parseInt(price),
        previousPrice: parseInt(previousPrice),
        images: images,
        color: color,
        brand: brand,
        category: {
          connect: {
            id: categoryId,
          },
        },
        tags: {
          connect: tagIDs.map((id: string) => ({ id: id })),
        },
      },
    });

    return Response.json({ newProduct }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return Response.json(e.message, { status: 500 });
  }
}
