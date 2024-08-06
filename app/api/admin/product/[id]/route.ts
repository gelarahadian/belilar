import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

  const { id } = params;

  const prisma = new PrismaClient();

  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        slug: slugify(title),
      },
    });

    if (existingProduct && existingProduct.id !== id) {
      return Response.json(`Product with name ${title} already exists`, {
        status: 409,
      });
    }

    const productUpdated = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        title,
        slug: slugify(title, { lower: true }),
        description,
        price: parseInt(price),
        previousPrice: parseInt(previousPrice),
        color,
        brand,
        images,
        categoryId,
        tagIDs,
      },
    });
    return Response.json({ productUpdated });
  } catch (err: any) {
    return Response.json({ err: err.message });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const prisma = new PrismaClient();

  try {
    const productDeleted = await prisma.product.delete({
      where: {
        id: id,
      },
    });
    return Response.json({ productDeleted });
  } catch (err: any) {
    return Response.json({ err: err.message });
  }
}
